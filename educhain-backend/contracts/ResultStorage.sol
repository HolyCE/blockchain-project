// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResultStorage {
    struct Result {
        string studentId;
        string courseCode;
        uint256 score;
        string grade;
        uint256 timestamp;
        address uploadedBy;
    }
    
    mapping(string => Result[]) public studentResults;
    mapping(bytes32 => bool) public resultHashes;
    
    event ResultUploaded(
        string indexed studentId,
        string courseCode,
        uint256 score,
        uint256 timestamp,
        address indexed uploadedBy
    );
    
    function uploadResult(
        string memory _studentId,
        string memory _courseCode,
        uint256 _score,
        string memory _grade
    ) public returns (bytes32) {
        require(_score <= 100, "Score cannot exceed 100");
        
        bytes32 resultHash = keccak256(
            abi.encodePacked(_studentId, _courseCode, _score, _grade, block.timestamp)
        );
        
        require(!resultHashes[resultHash], "Result already exists");
        
        Result memory newResult = Result({
            studentId: _studentId,
            courseCode: _courseCode,
            score: _score,
            grade: _grade,
            timestamp: block.timestamp,
            uploadedBy: msg.sender
        });
        
        studentResults[_studentId].push(newResult);
        resultHashes[resultHash] = true;
        
        emit ResultUploaded(_studentId, _courseCode, _score, block.timestamp, msg.sender);
        
        return resultHash;
    }
    
    function getStudentResults(string memory _studentId) 
        public 
        view 
        returns (Result[] memory) 
    {
        return studentResults[_studentId];
    }
    
    function verifyResult(
        string memory _studentId,
        string memory _courseCode,
        uint256 _score,
        string memory _grade,
        uint256 _timestamp
    ) public view returns (bool) {
        bytes32 resultHash = keccak256(
            abi.encodePacked(_studentId, _courseCode, _score, _grade, _timestamp)
        );
        return resultHashes[resultHash];
    }
}
