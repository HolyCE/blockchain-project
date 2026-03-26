// src/utils/blockchainUtils.js
const crypto = require('crypto');

class BlockchainUtils {
  static generateResultHash(resultData) {
    const dataString = JSON.stringify({
      studentId: resultData.studentId,
      courseCode: resultData.courseCode,
      score: resultData.score,
      grade: resultData.grade,
      semester: resultData.semester,
      academicSession: resultData.academicSession,
      timestamp: resultData.timestamp || new Date().toISOString()
    });
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
  
  static validateHash(originalData, hash) {
    const computedHash = this.generateResultHash(originalData);
    return computedHash === hash;
  }
  
  static createMerkleTree(results) {
    const leaves = results.map(r => this.generateResultHash(r));
    const tree = [leaves];
    let currentLevel = leaves;
    
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = crypto.createHash('sha256')
            .update(currentLevel[i] + currentLevel[i + 1])
            .digest('hex');
          nextLevel.push(combined);
        } else {
          nextLevel.push(currentLevel[i]);
        }
      }
      tree.push(nextLevel);
      currentLevel = nextLevel;
    }
    
    return { root: tree[tree.length - 1][0], tree: tree };
  }
}

module.exports = BlockchainUtils;
