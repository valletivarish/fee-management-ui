export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const DEMO_ACCOUNTS = [
  {
    id: 'admin',
    label: 'Administrator',
    role: 'admin',
    roleLabel: 'Administrator',
    usernameOrEmail:
      import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@example.com',
    password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'Admin@123',
    description: 'Full access to manage students, fee plans, and payments.',
  },
  {
    id: 'student-john',
    label: 'John Doe',
    role: 'student',
    roleLabel: 'Student - Computer Science',
    usernameOrEmail:
      import.meta.env.VITE_DEMO_STUDENT_EMAIL || 'john.doe@example.com',
    password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD || 'Student@123',
    description: 'Computer Science student, academic year 2024-2028.',
  },
  {
    id: 'student-priya',
    label: 'Priya Patel',
    role: 'student',
    roleLabel: 'Student - Business Administration',
    usernameOrEmail:
      import.meta.env.VITE_DEMO_STUDENT_EMAIL_2 || 'priya.patel@example.com',
    password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD_2 || 'Student2@123',
    description: 'Business Administration student, academic year 2023-2027.',
  },
  {
    id: 'student-arjun',
    label: 'Arjun Menon',
    role: 'student',
    roleLabel: 'Student - Mechanical Engineering',
    usernameOrEmail:
      import.meta.env.VITE_DEMO_STUDENT_EMAIL_3 || 'arjun.menon@example.com',
    password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD_3 || 'Student3@123',
    description: 'Mechanical Engineering student, academic year 2022-2026.',
  },
]

