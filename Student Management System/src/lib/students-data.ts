export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  grade: string;
  section: string;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Graduated" | "Suspended";
  address: string;
  guardianName: string;
  guardianPhone: string;
  avatar?: string;
  gpa: number;
}

const firstNames = ["Aarav", "Sophia", "Liam", "Emma", "Noah", "Olivia", "Ethan", "Ava", "Mason", "Isabella", "James", "Mia", "Benjamin", "Charlotte", "Lucas", "Amelia", "Henry", "Harper", "Alexander", "Evelyn"];
const lastNames = ["Patel", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lee"];
const grades = ["9th", "10th", "11th", "12th"];
const sections = ["A", "B", "C", "D"];
const statuses: Student["status"][] = ["Active", "Active", "Active", "Active", "Inactive", "Graduated", "Suspended"];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStudents(count: number): Student[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = randomPick(firstNames);
    const lastName = randomPick(lastNames);
    return {
      id: `STU-${String(i + 1).padStart(4, "0")}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@school.edu`,
      phone: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      dateOfBirth: `${2005 + Math.floor(Math.random() * 4)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, "0")}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, "0")}`,
      gender: randomPick(["Male", "Female", "Other"] as const),
      grade: randomPick(grades),
      section: randomPick(sections),
      enrollmentDate: `${2020 + Math.floor(Math.random() * 5)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, "0")}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, "0")}`,
      status: randomPick(statuses),
      address: `${Math.floor(100 + Math.random() * 9900)} ${randomPick(["Oak", "Maple", "Cedar", "Pine", "Elm"])} ${randomPick(["St", "Ave", "Blvd", "Dr"])}`,
      guardianName: `${randomPick(firstNames)} ${lastName}`,
      guardianPhone: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      gpa: Math.round((2.0 + Math.random() * 2.0) * 100) / 100,
    };
  });
}

export const studentsData: Student[] = generateStudents(25);

export const dashboardStats = {
  totalStudents: 25,
  activeStudents: studentsData.filter((s) => s.status === "Active").length,
  averageGpa: Math.round((studentsData.reduce((sum, s) => sum + s.gpa, 0) / studentsData.length) * 100) / 100,
  totalCourses: 18,
  attendanceRate: 94.2,
  graduatedCount: studentsData.filter((s) => s.status === "Graduated").length,
};
