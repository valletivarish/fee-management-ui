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
    skipPasswordPrompt: true,
  },
  {
    id: 'student-aditi',
    label: 'Aditi Sharma',
    role: 'student',
    roleLabel: 'Student - Computer Science Engineering',
    usernameOrEmail:
      import.meta.env.VITE_DEMO_STUDENT_EMAIL || 'aditi.sharma@example.com',
    password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD || 'Student1@123',
    description: 'Computer Science Engineering student, academic year 2021-2025.',
    skipPasswordPrompt: true,
  },
  {
    id: 'student-rahul',
    label: 'Rahul Desai',
    role: 'student',
    roleLabel: 'Student - Business Administration',
    usernameOrEmail:
      import.meta.env.VITE_DEMO_STUDENT_EMAIL_2 || 'rahul.desai@example.com',
    password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD_2 || 'Student2@123',
    description: 'Business Administration student, academic year 2023-2027.',
    skipPasswordPrompt: true,
  },
  {
    id: 'student-sofia',
    label: 'Sofia Fernandes',
    role: 'student',
    roleLabel: 'Student - Mechanical Engineering',
    usernameOrEmail:
      import.meta.env.VITE_DEMO_STUDENT_EMAIL_3 || 'sofia.fernandes@example.com',
    password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD_3 || 'Student3@123',
    description: 'Mechanical Engineering student, academic year 2022-2026.',
    skipPasswordPrompt: true,
  },
]

