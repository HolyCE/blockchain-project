const calculateGradePoint = (grade, score) => {
  const gradeMap = {
    'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0, 'P': 5.0
  };
  
  if (grade in gradeMap) return gradeMap[grade];
  
  // If grade not in map, calculate from score
  if (score >= 70) return 5.0;
  if (score >= 60) return 4.0;
  if (score >= 50) return 3.0;
  if (score >= 45) return 2.0;
  if (score >= 40) return 1.0;
  return 0.0;
};

const calculateGPA = (courses) => {
  let totalCredits = 0;
  let totalPoints = 0;

  courses.forEach(course => {
    if (course.gradePoint !== null && course.creditUnits) {
      totalCredits += course.creditUnits;
      totalPoints += course.gradePoint * course.creditUnits;
    }
  });

  return { 
    totalCredits, 
    totalPoints,
    gpa: totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0 
  };
};

const validateMatricNumber = (matricNumber) => {
  // Basic matric number validation (e.g., COM/20/1234, CSC/19/456)
  const matricRegex = /^[A-Z]{3,4}\/\d{2}\/\d{3,4}$/;
  return matricRegex.test(matricNumber);
};

const validateSession = (session) => {
  // Session format: 2023/2024
  const sessionRegex = /^\d{4}\/\d{4}$/;
  return sessionRegex.test(session);
};

module.exports = {
  calculateGradePoint,
  calculateGPA,
  validateMatricNumber,
  validateSession
};