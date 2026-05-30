import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute';
import Login from './page/login';
import Home from './page/home';
import Dashboard from './page/dashboard';
import Register from './page/register';
import ExamDetail from './page/exam-detail';
import ExamDo from './page/exam-do';
import Result from './page/result';
import CreateExam from './page/create-exam';
import Favorite from './page/favorite';
import History from './page/history';
import Report from './page/report';
import Profile from './page/profile';
import EditProfile from './page/edit-profile';
import AllExams from './page/all-exams';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้า public — ไม่ต้อง login ก็เข้าได้ */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* หน้าที่ต้อง login — ครอบด้วย ProtectedRoute */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-exam" element={<ProtectedRoute><CreateExam /></ProtectedRoute>} />
        <Route path="/edit-exam/:id" element={<ProtectedRoute><CreateExam /></ProtectedRoute>} />
        <Route path="/exam-detail/:id" element={<ProtectedRoute><ExamDetail /></ProtectedRoute>} />
        <Route path="/exam-do/:id" element={<ProtectedRoute><ExamDo /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/all-exams" element={<ProtectedRoute><AllExams /></ProtectedRoute>} />
        <Route path="/favorite" element={<ProtectedRoute><Favorite /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;