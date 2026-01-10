import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout/Layout';
import AdminDashboard from './pages/Admin/Dashboard';
import Landing from './pages/Public/Landing';
import DepartmentList from './pages/Admin/Departments/DepartmentList';
import AddDepartment from './pages/Admin/Departments/AddDepartment';
import CourseList from './pages/Admin/Courses/CourseList';
import AddCourse from './pages/Admin/Courses/AddCourse';
import SubjectList from './pages/Admin/Subjects/SubjectList';
import AddSubject from './pages/Admin/Subjects/AddSubject';
import UserList from './pages/Admin/Users/UserList';
import AddUser from './pages/Admin/Users/AddUser';
import EditUser from './pages/Admin/Users/EditUser';
import StudentAttendanceManager from './pages/Admin/Attendance/AttendanceManager';
import StaffAttendanceManager from './pages/Admin/Attendance/StaffAttendanceManager';
import TimetableManager from './pages/Admin/Timetable/TimetableManager';
import FeesManager from './pages/Admin/Fees/FeesManager';
import ExamManager from './pages/Admin/Exams/ExamManager';
import StaffDashboard from './pages/Staff/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import MySubjects from './pages/Staff/MySubjects';
import MarksEntry from './pages/Staff/MarksEntry';
import StudentResults from './pages/Student/ReportCard';
import AddStudent from './pages/Staff/AddStudent';
import StudentList from './pages/Staff/StudentList';
import DeptStaffList from './pages/Staff/DeptStaffList';
import Profile from './pages/Shared/Profile';
import StudentTimetable from './pages/Student/Timetable';
import AcademicCalendar from './pages/Shared/AcademicCalendar';
import StudentAttendance from './pages/Student/Attendance';
import StudentFees from './pages/Student/Fees';
import DocumentCreator from './pages/Tools/DocumentCreator';
import AIChatbot from './pages/Tools/AIChatbot';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  //...


  // If data is still loading, show nothing or a spinner
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  // Since we are mocking, as long as we have a user, we are good.
  // In strict mode we check roles, but for now let's be permissive or check if needed.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // simplified role check for the bypass
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Optionally you can redirect to an unauthorized page or dashboard
    // return <Navigate to="/" />;
    // For testing, let's just warn or allow
    console.warn(`User role ${user.role} not explicitly in allowed ${allowedRoles}`);
  }

  return <Layout>{children}</Layout>;
};

const DashboardPlaceholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <div className="card">
      <p>Welcome to your dashboard. Features loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['Administrator']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Department Routes */}
          <Route path="/admin/departments" element={
            <PrivateRoute allowedRoles={['Administrator']}>
              <DepartmentList />
            </PrivateRoute>
          } />
          <Route path="/admin/departments/add" element={
            <PrivateRoute allowedRoles={['Administrator']}>
              <AddDepartment />
            </PrivateRoute>
          } />

          {/* Course Routes */}
          <Route path="/admin/courses" element={<PrivateRoute allowedRoles={['Administrator']}><CourseList /></PrivateRoute>} />
          <Route path="/admin/courses/add" element={<PrivateRoute allowedRoles={['Administrator']}><AddCourse /></PrivateRoute>} />
          {/* Subject Routes */}
          <Route path="/admin/subjects" element={<PrivateRoute allowedRoles={['Administrator']}><SubjectList /></PrivateRoute>} />
          <Route path="/admin/subjects/add" element={<PrivateRoute allowedRoles={['Administrator']}><AddSubject /></PrivateRoute>} />
          {/* User Management Routes */}
          <Route path="/admin/users" element={<PrivateRoute allowedRoles={['Administrator']}><UserList /></PrivateRoute>} />
          <Route path="/admin/users/add" element={<PrivateRoute allowedRoles={['Administrator']}><AddUser /></PrivateRoute>} />
          <Route path="/admin/users/edit/:id" element={<PrivateRoute allowedRoles={['Administrator']}><EditUser /></PrivateRoute>} />

          {/* Attendance Routes */}
          <Route path="/admin/attendance" element={<PrivateRoute allowedRoles={['Administrator']}><StaffAttendanceManager /></PrivateRoute>} />
          {/* Timetable Routes */}
          {/* Timetable Manager - Moved to Staff but Admin keeps access */}
          <Route path="/staff/timetable" element={<PrivateRoute allowedRoles={['Staff', 'Administrator']}><TimetableManager /></PrivateRoute>} />

          {/* Fees Routes */}
          <Route path="/admin/fees" element={<PrivateRoute allowedRoles={['Administrator']}><FeesManager /></PrivateRoute>} />
          {/* Exam Routes */}
          <Route path="/admin/exams" element={<PrivateRoute allowedRoles={['Administrator']}><ExamManager /></PrivateRoute>} />

          {/* Staff Routes */}
          <Route path="/staff/dashboard" element={
            <PrivateRoute allowedRoles={['Staff']}>
              <StaffDashboard />
            </PrivateRoute>
          } />
          <Route path="/staff/attendance" element={
            <PrivateRoute allowedRoles={['Staff']}>
              <StudentAttendanceManager />
            </PrivateRoute>
          } />
          <Route path="/staff/subjects" element={
            <PrivateRoute allowedRoles={['Staff']}>
              <MySubjects />
            </PrivateRoute>
          } />
          <Route path="/staff/marks" element={
            <PrivateRoute allowedRoles={['Staff']}>
              <MarksEntry />
            </PrivateRoute>
          } />
          <Route path="/staff/add-student" element={
            <PrivateRoute allowedRoles={['Staff']}>
              <AddStudent />
            </PrivateRoute>
          } />
          <Route path="/staff/students" element={
            <PrivateRoute allowedRoles={['Staff']}>
              <StudentList />
            </PrivateRoute>
          } />
          <Route path="/staff/faculty" element={
            <PrivateRoute allowedRoles={['Staff', 'Administrator']}>
              <DeptStaffList />
            </PrivateRoute>
          } />

          {/* Shared Profile */}
          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['Administrator', 'Staff', 'Student']}>
              <Profile />
            </PrivateRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <PrivateRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/student/attendance" element={
            <PrivateRoute allowedRoles={['Student']}>
              <StudentAttendance />
            </PrivateRoute>
          } />
          <Route path="/student/timetable" element={
            <PrivateRoute allowedRoles={['Student']}>
              <StudentTimetable />
            </PrivateRoute>
          } />
          <Route path="/calendar" element={
            <PrivateRoute allowedRoles={['Administrator', 'Staff', 'Student']}>
              <AcademicCalendar />
            </PrivateRoute>
          } />
          <Route path="/student/fees" element={
            <PrivateRoute allowedRoles={['Student']}>
              <StudentFees />
            </PrivateRoute>
          } />
          <Route path="/student/marks" element={
            <PrivateRoute allowedRoles={['Student']}>
              <StudentResults />
            </PrivateRoute>
          } />

          {/* Shared Tools */}
          <Route path="/tools/document-creator" element={
            <PrivateRoute allowedRoles={['Administrator', 'Staff']}>
              <DocumentCreator />
            </PrivateRoute>
          } />
          <Route path="/tools/chatbot" element={
            <PrivateRoute allowedRoles={['Administrator', 'Staff', 'Student']}>
              <AIChatbot />
            </PrivateRoute>
          } />

          <Route path="*" element={<div className="p-8 text-center text-red-500">404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
