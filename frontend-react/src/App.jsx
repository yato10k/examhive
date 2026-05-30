import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam-do/:id" element={<ExamDo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/result" element={<Result />} />
        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/edit-exam/:id" element={<CreateExam />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/history" element={<History />} />
        <Route path="/report" element={<Report />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/all-exams" element={<AllExams />} />
        <Route path="/exam-detail/:id" element={<ExamDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;