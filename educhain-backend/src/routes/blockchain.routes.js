const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const blockchainService = require('../blockchain/config');
const ResultRequest = require('../models/ResultRequest');

router.get('/status', auth, async (req, res) => {
  try {
    const isConnected = await blockchainService.init();
    res.json({ connected: isConnected, network: 'Ganache', address: 'http://127.0.0.1:7545' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/store/:resultId', auth, authorize('admin'), async (req, res) => {
  try {
    const { resultId } = req.params;
    const resultRequest = await ResultRequest.findById(resultId);
    if (!resultRequest) return res.status(404).json({ message: 'Result not found' });
    
    if (resultRequest.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed results can be stored on blockchain' });
    }
    
    const resultData = {
      resultId: resultRequest._id.toString(),
      studentId: resultRequest.matricNumber,
      studentName: resultRequest.studentName,
      courses: resultRequest.courses.map(c => ({
        courseCode: c.courseCode,
        courseTitle: c.courseTitle,
        grade: c.grade,
        score: c.score,
        creditUnits: c.creditUnits,
        gradePoint: c.gradePoint
      })),
      gpa: resultRequest.finalResult?.gpa,
      semester: resultRequest.semester,
      academicSession: resultRequest.academicSession,
      timestamp: new Date().toISOString()
    };
    
    const hash = blockchainService.hashResult(resultData);
    const tx = await blockchainService.storeResultHash(
      resultRequest._id.toString(),
      resultRequest.matricNumber,
      resultRequest.studentName,
      resultRequest.courses,
      resultRequest.finalResult?.gpa,
      resultRequest.semester,
      resultRequest.academicSession
    );
    
    if (tx.success) {
      resultRequest.blockchainHash = tx.resultHash;
      resultRequest.transactionHash = tx.transactionHash;
      resultRequest.blockNumber = tx.blockNumber;
      resultRequest.verifiedOnBlockchain = true;
      resultRequest.verificationDate = new Date();
      await resultRequest.save();
      
      res.json({ 
        message: 'Result stored on blockchain successfully', 
        hash: tx.resultHash, 
        transaction: tx 
      });
    } else {
      res.status(500).json({ message: 'Blockchain transaction failed', error: tx.error });
    }
  } catch (error) {
    console.error('Error storing on blockchain:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/verify/:resultId', auth, async (req, res) => {
  try {
    const { resultId } = req.params;
    const resultRequest = await ResultRequest.findById(resultId);
    if (!resultRequest) return res.status(404).json({ message: 'Result not found' });
    
    const resultData = {
      resultId: resultRequest._id.toString(),
      studentId: resultRequest.matricNumber,
      studentName: resultRequest.studentName,
      courses: resultRequest.courses.map(c => ({
        courseCode: c.courseCode,
        courseTitle: c.courseTitle,
        grade: c.grade,
        score: c.score,
        creditUnits: c.creditUnits,
        gradePoint: c.gradePoint
      })),
      gpa: resultRequest.finalResult?.gpa,
      semester: resultRequest.semester,
      academicSession: resultRequest.academicSession,
      timestamp: resultRequest.updatedAt
    };
    
    const currentHash = blockchainService.hashResult(resultData);
    const storedHash = resultRequest.blockchainHash;
    const isValid = currentHash === storedHash;
    
    res.json({
      resultId,
      isValid,
      storedHash: storedHash ? storedHash.substring(0, 20) + '...' : null,
      currentHash: currentHash.substring(0, 20) + '...',
      message: isValid ? '✅ Result verified - No tampering detected' : '❌ Result has been tampered with!'
    });
  } catch (error) {
    console.error('Error verifying result:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
