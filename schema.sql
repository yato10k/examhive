-- ============================================
-- EXAMHIVE — schema.sql (MySQL)
-- DSI104 Hackathon · ER 8 ตาราง
-- แก้ตามคำแนะนำอาจารย์: ENUM, constraint, FK ครบ
-- ============================================

-- ----- ลบของเก่าก่อน (ลำดับ: ลบลูกก่อนพ่อ) -----
-- เหตุผล: ตารางที่ถูกอ้างถึงด้วย FK จะลบทีหลังเสมอ
DROP TABLE IF EXISTS attempt_answers;
DROP TABLE IF EXISTS attempts;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS choices;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS exam_sets;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;

-- ----- สร้างใหม่ (ลำดับ: สร้างพ่อก่อนลูก) -----
-- เหตุผล: FK อ้างถึงตารางไหน ตารางนั้นต้องมีอยู่ก่อน

-- 1) users : บัญชีผู้ใช้
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,        -- ห้ามซ้ำ กันสมัครซ้ำ
  password_hash VARCHAR(255) NOT NULL,               -- เก็บ hash เท่านั้น ไม่เก็บรหัสจริง
  display_name  VARCHAR(100),
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',  -- คุมค่าตายตัว
  tier          ENUM('free','pro')   NOT NULL DEFAULT 'free',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- ใส่เวลาให้อัตโนมัติ
);

-- 2) subjects : หมวดวิชา (admin สร้าง)
CREATE TABLE subjects (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  created_by INT,                                     -- ใครสร้าง (อ้างถึง users)
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 3) exam_sets : ชุดข้อสอบ
CREATE TABLE exam_sets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  owner_id    INT NOT NULL,                           -- เจ้าของชุด (ต้องมีเสมอ)
  subject_id  INT,                                    -- วิชา (อาจยังไม่จัดหมวดได้)
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  visibility  ENUM('private','public')           NOT NULL DEFAULT 'private', -- private by default
  source      ENUM('manual','ai')                NOT NULL DEFAULT 'manual',
  license_tag VARCHAR(50),                            -- ป้ายสิทธิ์ เช่น self-made / CC
  status      ENUM('draft','pending','approved') NOT NULL DEFAULT 'draft',  -- สถานะ moderate
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id)   REFERENCES users(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- 4) questions : คำถามในชุด
CREATE TABLE questions (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  exam_set_id    INT NOT NULL,                        -- ต้องสังกัดชุดเสมอ ลอยเดี่ยวไม่ได้
  type           ENUM('mcq','tf','short') NOT NULL,   -- ชนิดคำถาม คุมค่าด้วย ENUM
  stem           TEXT NOT NULL,                       -- ตัวโจทย์ ยาวได้ไม่จำกัด
  explanation    TEXT,                                -- เฉลย/คำอธิบาย
  ai_generated   TINYINT(1) NOT NULL DEFAULT 0,       -- 0=คนเขียน 1=AI ออก
  question_order INT,                                 -- ลำดับข้อในชุด
  FOREIGN KEY (exam_set_id) REFERENCES exam_sets(id)
);

-- 5) choices : ตัวเลือกของคำถาม
CREATE TABLE choices (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,                           -- ต้องสังกัดคำถามเสมอ
  text        VARCHAR(500) NOT NULL,
  is_correct  TINYINT(1) NOT NULL DEFAULT 0,          -- เฉลย: ตัวเลือกนี้ถูกไหม
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- 6) attempts : การทำสอบแต่ละรอบ
CREATE TABLE attempts (
  id          INT AUTO_INCREMENT PRIMARY KEY,         -- PK เดี่ยว = ทำซ้ำหลายรอบได้
  user_id     INT NOT NULL,
  exam_set_id INT NOT NULL,
  score       INT,                                    -- ได้กี่ข้อ (เติมตอนตรวจเสร็จ)
  total       INT,                                    -- เต็มกี่ข้อ
  started_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP NULL,                         -- NULL ระหว่างยังทำอยู่
  FOREIGN KEY (user_id)     REFERENCES users(id),
  FOREIGN KEY (exam_set_id) REFERENCES exam_sets(id)
);

-- 7) attempt_answers : คำตอบรายข้อในแต่ละรอบ
CREATE TABLE attempt_answers (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id       INT NOT NULL,
  question_id      INT NOT NULL,
  chosen_choice_id INT,                               -- NULL = ข้ามข้อ ไม่ตอบ
  is_correct       TINYINT(1) NOT NULL DEFAULT 0,     -- ผลรอบนั้น (snapshot กันเฉลยถูกแก้ภายหลัง)
  FOREIGN KEY (attempt_id)       REFERENCES attempts(id),
  FOREIGN KEY (question_id)      REFERENCES questions(id),
  FOREIGN KEY (chosen_choice_id) REFERENCES choices(id)
);

-- 8) reports : รายงานชุดสาธารณะที่ผิดลิขสิทธิ์
CREATE TABLE reports (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL,
  exam_set_id INT NOT NULL,
  reason      VARCHAR(500),
  status      ENUM('open','resolved') NOT NULL DEFAULT 'open',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  FOREIGN KEY (exam_set_id) REFERENCES exam_sets(id)
);
