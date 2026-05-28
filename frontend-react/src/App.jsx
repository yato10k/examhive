import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './page/login';
import Home from './page/home';
import Dashboard from './page/dashboard';
import Register from './page/register'; // ✅ 1. นำเข้าหน้า Register ตรงนี้
import ExamDetail from './page/exam-detail';
import ExamDo from './page/exam-do';
import Result from './page/result';
import CreateExam from './page/create-exam';
import Favorite from './page/favorite';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam-detail" element={<ExamDetail />} />
        <Route path="/exam-do" element={<ExamDo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/result" element={<Result />} />
        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/favorite" element={<Favorite />} />
        {/* ชั่วคราว: สำหรับหน้าประวัติที่ยังไม่ได้ทำ */}
        <Route path="/history" element={<div className="page-wrapper"><h1>นี่คือหน้า ประวัติคะแนน</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;