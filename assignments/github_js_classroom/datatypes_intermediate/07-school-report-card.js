/**
 * 📝 School Report Card Generator
 *
 * Sharma ji ke bete ka report card generate karna hai! Student ka naam aur
 * subjects ke marks milenge, tujhe pura analysis karke report card banana hai.
 *
 * Rules:
 *   - student object: { name: "Rahul", marks: { maths: 85, science: 92, ... } }
 *   - Calculate using Object.values() and array methods:
 *     - totalMarks: sum of all marks (use reduce)
 *     - percentage: (totalMarks / (numSubjects * 100)) * 100,
 *       rounded to 2 decimal places using parseFloat(val.toFixed(2))
 *     - grade based on percentage:
 *       "A+" (>= 90), "A" (>= 80), "B" (>= 70), "C" (>= 60), "D" (>= 40), "F" (< 40)
 *     - highestSubject: subject name with highest marks (use Object.entries)
 *     - lowestSubject: subject name with lowest marks
 *     - passedSubjects: array of subject names where marks >= 40 (use filter)
 *     - failedSubjects: array of subject names where marks < 40
 *     - subjectCount: total number of subjects (Object.keys().length)
 *   - Hint: Use Object.keys(), Object.values(), Object.entries(),
 *     reduce(), filter(), map(), Math.max(), Math.min(), toFixed()
 *
 * Validation:
 *   - Agar student object nahi hai ya null hai, return null
 *   - Agar student.name string nahi hai ya empty hai, return null
 *   - Agar student.marks object nahi hai ya empty hai (no keys), return null
 *   - Agar koi mark valid number nahi hai (not between 0 and 100 inclusive),
 *     return null
 *
 * @param {{ name: string, marks: Object<string, number> }} student
 * @returns {{ name: string, totalMarks: number, percentage: number, grade: string, highestSubject: string, lowestSubject: string, passedSubjects: string[], failedSubjects: string[], subjectCount: number } | null}
 *
 * @example
 *   generateReportCard({ name: "Rahul", marks: { maths: 85, science: 92, english: 78 } })
 *   // => { name: "Rahul", totalMarks: 255, percentage: 85, grade: "A",
 *   //      highestSubject: "science", lowestSubject: "english",
 *   //      passedSubjects: ["maths", "science", "english"], failedSubjects: [],
 *   //      subjectCount: 3 }
 *
 *   generateReportCard({ name: "Priya", marks: { maths: 35, science: 28 } })
 *   // => { name: "Priya", totalMarks: 63, percentage: 31.5, grade: "F", ... }
 */

function returnGrade(percentage) {
  switch (true) {
    case percentage >= 90:
      return "A+";
    case percentage >= 80:
      return "A";
    case percentage >= 70:
      return "B";
    case percentage >= 60:
      return "C";
    case percentage >= 40:
      return "D";
    case percentage < 40:
      return "F";
    default:
      return "INVALID PERCENTAGE";
  }
}

export function generateReportCard(student) {
  // constraints
  if (
    typeof student !== "object" ||
    student === null ||
    typeof student.marks !== "object" ||
    student.marks === null
  ) {
    return null;
  }

  // validations
  if (!student.name || Object.keys(student.marks).length === 0) {
    return null;
  }

  const subjectCount = Object.keys(student.marks).length;

  for (const mark of Object.values(student.marks)) {
    if (typeof mark !== "number" || isNaN(mark) || mark < 0 || mark > 100) {
      return null;
    }
  }

  // core
  const totalMarks = Object.values(student.marks).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const percentage = (totalMarks / (subjectCount * 100)) * 100;
  const percentageForOutput = parseFloat(percentage.toFixed(2));

  const highestSubjectEntry = Object.entries(student.marks).reduce(
    (prev, current) => (prev[1] > current[1] ? prev : current),
  );
  const lowestSubjectEntry = Object.entries(student.marks).reduce(
    (prev, current) => (prev[1] < current[1] ? prev : current),
  );

  const highestSubject = highestSubjectEntry[0];
  const lowestSubject = lowestSubjectEntry[0];

  const passedSubjects = Object.entries(student.marks)
    .filter(([, marks]) => marks >= 40)
    .map(([subject]) => subject);
  const failedSubjects = Object.entries(student.marks)
    .filter(([, marks]) => marks < 40)
    .map(([subject]) => subject);

  const grade = returnGrade(percentage);

  return {
    name: student.name,
    totalMarks,
    percentage: percentageForOutput,
    grade,
    highestSubject,
    lowestSubject,
    passedSubjects,
    failedSubjects,
    subjectCount,
  };
}
