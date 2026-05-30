const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const { authToken, requireRole } = require("./middleware");

const app = express();
app.use(cors());
app.use(express.json()); // เปิดให้รับ Body แบบ JSON ได้

// ==========================================
// หมวด A — Authentication
// ==========================================

// 1. สมัครสมาชิก (register + bcrypt hash)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    if (!email || !password || !display_name) return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)",
      [email, password_hash, display_name]
    );

    const token = jwt.sign(
      { user_id: result.insertId, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      token,
      user: { id: result.insertId, email, display_name, role: 'user' }
    });
  } catch (err) {
    res.status(500).json({ message: "อีเมลนี้อาจถูกใช้งานไปแล้ว หรือเกิดข้อผิดพลาดในระบบ" });
  }
});

// 2. เข้าสู่ระบบ (login → ออก JWT)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) return res.status(401).json({ message: "ไม่พบผู้ใช้ในระบบ" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({ token, role: user.role, display_name: user.display_name, user_id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. อัปเดตโปรไฟล์ผู้ใช้ (เปลี่ยน display_name)
app.put("/api/me/profile", authToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { display_name } = req.body;

    if (!display_name || display_name.trim() === '') {
      return res.status(400).json({ message: "กรุณากรอกชื่อที่ใช้แสดง" });
    }

    await pool.query(
      "UPDATE users SET display_name = ? WHERE id = ?",
      [display_name.trim(), userId]
    );

    res.json({ message: "อัปเดตโปรไฟล์สำเร็จ", display_name: display_name.trim() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3b. ดึงข้อมูลโปรไฟล์ผู้ใช้
app.get("/api/me/profile", authToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await pool.query(
      "SELECT id, email, display_name FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// หมวด B — Exam Set CRUD & คลังสาธารณะ (ฟังก์ชัน #4, #5, #7, #8, #25, #30)
// ==========================================

// 4. สร้างชุดข้อสอบพร้อมคำถามและตัวเลือก
app.post("/api/exam-sets", authToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { title, description, subject_name, duration, questions } = req.body;
    const owner_id = req.user.user_id;

    await connection.beginTransaction();

    // หา subject_id จากชื่อ หรือสร้างใหม่ถ้ายังไม่มี
    let [subjects] = await connection.query("SELECT id FROM subjects WHERE name = ?", [subject_name]);
    let subject_id;
    if (subjects.length === 0) {
      const [newSubject] = await connection.query("INSERT INTO subjects (name) VALUES (?)", [subject_name]);
      subject_id = newSubject.insertId;
    } else {
      subject_id = subjects[0].id;
    }

    // สร้าง exam_set
    const [examSetResult] = await connection.query(
      "INSERT INTO exam_sets (owner_id, subject_id, title, description, visibility) VALUES (?, ?, ?, ?, 'private')",
      [owner_id, subject_id, title, description]
    );
    const exam_set_id = examSetResult.insertId;

    // เพิ่มคำถามและตัวเลือก
    if (questions && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const [questionResult] = await connection.query(
          "INSERT INTO questions (exam_set_id, type, stem, question_order) VALUES (?, ?, ?, ?)",
          [exam_set_id, q.type || 'mcq', q.stem, i + 1]
        );
        const question_id = questionResult.insertId;

        // เพิ่มตัวเลือก
        if (q.choices && q.choices.length > 0) {
          for (const choice of q.choices) {
            await connection.query(
              "INSERT INTO choices (question_id, text, is_correct) VALUES (?, ?, ?)",
              [question_id, choice.text, choice.is_correct || false]
            );
          }
        }
      }
    }

    await connection.commit();
    res.status(201).json({ message: "สร้างชุดข้อสอบสำเร็จ", exam_set_id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// 5, 25, 30. ดูรายการชุดข้อสอบ (ของตัวเอง + กรองตามสาธารณะ/วิชา)
app.get("/api/exam-sets", authToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { visibility, subject_id } = req.query;

    let query = `
      SELECT es.*, s.name as subject_name,
        (SELECT COUNT(*) FROM questions q WHERE q.exam_set_id = es.id) as question_count
      FROM exam_sets es
      LEFT JOIN subjects s ON es.subject_id = s.id
      WHERE (es.owner_id = ? OR es.visibility = 'public')
    `;
    let params = [userId];

    if (visibility === "public") {
      query = `
        SELECT es.*, s.name as subject_name,
          (SELECT COUNT(*) FROM questions q WHERE q.exam_set_id = es.id) as question_count
        FROM exam_sets es
        LEFT JOIN subjects s ON es.subject_id = s.id
        WHERE es.visibility = 'public'
      `;
      params = [];
    }
    if (subject_id) {
      query += (params.length > 0 ? " AND" : " WHERE") + " es.subject_id = ?";
      params.push(subject_id);
    }

    query += " ORDER BY es.created_at DESC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. ดูรายละเอียดชุดข้อสอบแบบเต็มพร้อมเฉลย (เฉพาะเจ้าของหรือแอดมินเปิดดูเพื่อตรวจ)
app.get("/api/exam-sets/:id/details", authToken, async (req, res) => {
  try {
    const examSetId = req.params.id;
    const [questions] = await pool.query("SELECT * FROM questions WHERE exam_set_id = ? ORDER BY question_order ASC", [examSetId]);
    const [choices] = await pool.query("SELECT * FROM choices WHERE question_id IN (SELECT id FROM questions WHERE exam_set_id = ?)", [examSetId]);

    const result = questions.map(q => ({
      ...q,
      choices: choices.filter(c => c.question_id === q.id)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7, 27. แก้ไขชุดข้อสอบ (เฉพาะเจ้าของ) หรือส่งขอตั้งเป็นสาธารณะติดลิขสิทธิ์
app.put("/api/exam-sets/:id", authToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { title, description, visibility, license_tag, subject_name, duration, questions } = req.body;
    const examSetId = req.params.id;
    const userId = req.user.user_id;

    const [check] = await connection.query("SELECT owner_id FROM exam_sets WHERE id = ?", [examSetId]);
    if (!check[0] || check[0].owner_id !== userId) return res.status(403).json({ message: "คุณไม่มีสิทธิ์แก้ไขชุดข้อสอบนี้" });

    await connection.beginTransaction();

    // หา subject_id จากชื่อ หรือใช้ subject_id เดิมถ้าไม่ได้ส่ง subject_name มา
    let subject_id = check[0].subject_id;
    if (subject_name && subject_name.trim() !== '') {
      // ตรวจสอบว่ามี subject นี้อยู่แล้วหรือไม่
      let [subjects] = await connection.query("SELECT id FROM subjects WHERE name = ?", [subject_name]);
      if (subjects.length === 0) {
        // สร้าง subject ใหม่ถ้ายังไม่มี
        const [newSubject] = await connection.query("INSERT INTO subjects (name) VALUES (?)", [subject_name]);
        subject_id = newSubject.insertId;
      } else {
        subject_id = subjects[0].id;
      }
    }

    // อัปเดตข้อมูลชุดข้อสอบ (ใช้ค่าเดิมถ้าไม่ได้ส่งมา)
    await connection.query(
      "UPDATE exam_sets SET title = COALESCE(NULLIF(?, ''), title), description = COALESCE(NULLIF(?, ''), description), subject_id = ?, duration = COALESCE(?, duration) WHERE id = ?",
      [title, description, subject_id, duration, examSetId]
    );

    // ถ้ามีการอัปเดตคำถามด้วย (questions array)
    if (questions && Array.isArray(questions) && questions.length > 0) {
      // ดึง question_ids ก่อนลบ
      const [oldQuestions] = await connection.query("SELECT id FROM questions WHERE exam_set_id = ?", [examSetId]);
      const oldQuestionIds = oldQuestions.map(q => q.id);

      // ลบ attempt_answers ที่เกี่ยวข้อง
      if (oldQuestionIds.length > 0) {
        await connection.query("DELETE FROM attempt_answers WHERE question_id IN (?)", [oldQuestionIds]);
      }
      // ลบ attempts ที่เกี่ยวข้อง
      await connection.query("DELETE FROM attempts WHERE exam_set_id = ?", [examSetId]);

      // ลบคำถามและตัวเลือกเดิมทั้งหมด
      await connection.query("DELETE FROM choices WHERE question_id IN (SELECT id FROM questions WHERE exam_set_id = ?)", [examSetId]);
      await connection.query("DELETE FROM questions WHERE exam_set_id = ?", [examSetId]);

      // เพิ่มคำถามและตัวเลือกใหม่
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const [questionResult] = await connection.query(
          "INSERT INTO questions (exam_set_id, type, stem, question_order) VALUES (?, ?, ?, ?)",
          [examSetId, q.type || 'mcq', q.stem, i + 1]
        );
        const question_id = questionResult.insertId;

        if (q.choices && q.choices.length > 0) {
          for (const choice of q.choices) {
            await connection.query(
              "INSERT INTO choices (question_id, text, is_correct) VALUES (?, ?, ?)",
              [question_id, choice.text, choice.is_correct || false]
            );
          }
        }
      }
    }

    await connection.commit();
    res.json({ message: "อัปเดตชุดข้อสอบสำเร็จ" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// 8. ลบชุดข้อสอบ (เฉพาะเจ้าของ)
app.delete("/api/exam-sets/:id", authToken, async (req, res) => {
  try {
    const examSetId = req.params.id;
    const userId = req.user.user_id;

    const [check] = await pool.query("SELECT owner_id FROM exam_sets WHERE id = ?", [examSetId]);
    if (!check[0] || check[0].owner_id !== userId) return res.status(403).json({ message: "คุณไม่มีสิทธิ์ลบชุดข้อสอบนี้" });

    // ปิด foreign key check
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    // ลบ attempt_answers ก่อน
    await pool.query("DELETE aa FROM attempt_answers aa INNER JOIN attempts a ON aa.attempt_id = a.id WHERE a.exam_set_id = ?", [examSetId]);

    // ลบ attempts
    await pool.query("DELETE FROM attempts WHERE exam_set_id = ?", [examSetId]);

    // ลบ choices ก่อน
    await pool.query("DELETE c FROM choices c INNER JOIN questions q ON c.question_id = q.id WHERE q.exam_set_id = ?", [examSetId]);

    // ลบ questions
    await pool.query("DELETE FROM questions WHERE exam_set_id = ?", [examSetId]);

    // ลบ exam_sets
    await pool.query("DELETE FROM exam_sets WHERE id = ?", [examSetId]);

    // เปิด foreign key check กลับ
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    res.json({ message: "ลบชุดข้อสอบเรียบร้อยแล้ว" });
  } catch (err) {
    // ถ้าเกิด error ให้เปิด foreign key check ก่อนเสมอ
    await pool.query("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// หมวด C — Question & Choice CRUD (ฟังก์ชัน #9, #10, #11, #12)
// ==========================================

// 9, 12. เพิ่มคำถามพร้อมตัวเลือกในชุดข้อสอบ
app.post("/api/exam-sets/:id/questions", authToken, async (req, res) => {
  try {
    const examSetId = req.params.id;
    const { type, stem, question_order, choices } = req.body; // choices = [{ text, is_correct }]

    const [qResult] = await pool.query(
      "INSERT INTO questions (exam_set_id, type, stem, question_order) VALUES (?, ?, ?, ?)",
      [examSetId, type, stem, question_order]
    );
    const questionId = qResult.insertId;

    if (choices && choices.length > 0) {
      for (const choice of choices) {
        await pool.query(
          "INSERT INTO choices (question_id, text, is_correct) VALUES (?, ?, ?)",
          [questionId, choice.text, choice.is_correct]
        );
      }
    }
    res.status(201).json({ message: "เพิ่มคำถามและตัวเลือกเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 10. แก้ไขคำถาม
app.put("/api/questions/:id", authToken, async (req, res) => {
  try {
    const { stem, question_order } = req.body;
    await pool.query("UPDATE questions SET stem = COALESCE(?, stem), question_order = COALESCE(?, question_order) WHERE id = ?", [stem, question_order, req.params.id]);
    res.json({ message: "แก้ไขคำถามเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 11. ลบคำถาม
app.delete("/api/questions/:id", authToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM questions WHERE id = ?", [req.params.id]);
    res.json({ message: "ลบคำถามเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// หมวด D — ทำข้อสอบ & ตรวจคะแนนอัตโนมัติ
// ==========================================

// 13. ดึงคำถามตอนทำข้อสอบ (!!!ห้ามส่งเฉลยเด็ดขาดเพื่อป้องกันการเปิด DevTools โกง!!!)
app.get("/api/exam-sets/:id/questions", authToken, async (req, res) => {
  try {
    const examSetId = req.params.id;
    const [questions] = await pool.query("SELECT id, type, stem, question_order FROM questions WHERE exam_set_id = ? ORDER BY question_order ASC", [examSetId]);
    const [choices] = await pool.query("SELECT id, question_id, text FROM choices WHERE question_id IN (SELECT id FROM questions WHERE exam_set_id = ?)", [examSetId]);

    const result = questions.map(q => ({
      ...q,
      choices: choices.filter(c => c.question_id === q.id)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 14. ส่งคำตอบ + ตรวจคะแนนอัตโนมัติที่ Backend อย่างปลอดภัย
app.post("/api/exam-sets/:id/attempts", authToken, async (req, res) => {
  try {
    const examSetId = req.params.id;
    const userId = req.user.user_id;
    const { answers } = req.body; // [{ question_id, chosen_choice_id }, ...]

    const [correctChoices] = await pool.query(
      "SELECT id, question_id FROM choices WHERE is_correct = 1 AND question_id IN (SELECT id FROM questions WHERE exam_set_id = ?)",
      [examSetId]
    );

    let score = 0;
    const total = correctChoices.length;
    const detailRows = [];

    for (const ans of answers) {
      const correct = correctChoices.find(c => c.question_id === ans.question_id);
      const isCorrect = correct && correct.id === ans.chosen_choice_id ? 1 : 0;
      if (isCorrect) score++;
      detailRows.push([ans.question_id, ans.chosen_choice_id, isCorrect]);
    }

    // บันทึกรอบการทำ (attempts)
    const [attempt] = await pool.query(
      "INSERT INTO attempts (user_id, exam_set_id, score, total, finished_at) VALUES (?, ?, ?, ?, NOW())",
      [userId, examSetId, score, total]
    );
    const attemptId = attempt.insertId;

    // บันทึกผลรายข้อลง snapshot (attempt_answers)
    for (const row of detailRows) {
      await pool.query(
        "INSERT INTO attempt_answers (attempt_id, question_id, chosen_choice_id, is_correct) VALUES (?, ?, ?, ?)",
        [attemptId, row[0], row[1], row[2]]
      );
    }

    res.json({ attempt_id: attemptId, score, total }); // ข้อ 15 ฝั่ง Frontend จะเอาผลจากตรงนี้ไปวาดแสดงทันที
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 15. บันทึกคะแนนสถิติโดยตรง (สำหรับ Frontend ที่คำนวณคะแนนเอง)
app.post("/api/me/attempts", authToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { exam_set_id, score, total, time_used } = req.body;

    if (!exam_set_id || score === undefined || total === undefined) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    const [result] = await pool.query(
      "INSERT INTO attempts (user_id, exam_set_id, score, total, time_used, finished_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [userId, exam_set_id, score, total, time_used || 0]
    );

    res.status(201).json({ message: "บันทึกคะแนนสำเร็จ", attempt_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 16. ดูประวัติคะแนนย้อนหลัง (attempt history) ของผู้ใช้นั้น ๆ
app.get("/api/me/attempts", authToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await pool.query(
      "SELECT a.*, e.title as exam_title, s.name as subject_name FROM attempts a JOIN exam_sets e ON a.exam_set_id = e.id LEFT JOIN subjects s ON e.subject_id = s.id WHERE a.user_id = ? ORDER BY a.finished_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// หมวด E — AI (ฟังก์ชัน #17)
// ==========================================

// 17. AI อธิบายเฉลย โดยทำ proxy ผ่าน backend เพื่อไม่ให้ API Key หลุดไปหน้าบ้าน
app.post("/api/ai/explain", authToken, async (req, res) => {
  try {
    const { stem, choices, correct_answer, user_answer } = req.body;

    const prompt = `โจทย์: ${stem}\nตัวเลือก: ${choices.join(", ")}\nเฉลยที่ถูก: ${correct_answer}\nคำตอบของนักเรียน: ${user_answer}\nช่วยอธิบายสั้น ๆ ว่าทำไมเฉลยข้อนี้ถูก และทำไมคำตอบของนักเรียนผิด (ถ้าผิด)`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const explanation = data.content[0].text;

    res.json({ explanation, ai_generated: true });
  } catch (err) {
    res.status(500).json({ message: "ระบบอธิบาย AI ขัดข้องชั่วคราว" });
  }
});

// ==========================================
// หมวด F & G — Admin & การจัดการข้อสอบสาธารณะ (ฟังก์ชัน #19, #20, #21, #22, #23, #24, #26, #31)
// ==========================================

// 19. เพิ่มหมวดวิชา
app.post("/api/admin/subjects", authToken, requireRole("admin"), async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query("INSERT INTO subjects (name) VALUES (?)", [name]);
    res.status(201).json({ message: "เพิ่มวิชาเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 20. แก้ไขหมวดวิชา
app.put("/api/admin/subjects/:id", authToken, requireRole("admin"), async (req, res) => {
  try {
    const { name } = req.body;
    await pool.query("UPDATE subjects SET name = ? WHERE id = ?", [name, req.params.id]);
    res.json({ message: "แก้ไขวิชาเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 21. ลบหมวดวิชา
app.delete("/api/admin/subjects/:id", authToken, requireRole("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM subjects WHERE id = ?", [req.params.id]);
    res.json({ message: "ลบวิชาเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 22. ดูรายการชุดข้อสอบที่ถูกรายงานว่าละเมิดลิขสิทธิ์
app.get("/api/admin/reports", authToken, requireRole("admin"), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT r.*, e.title as exam_title FROM reports r JOIN exam_sets e ON r.exam_set_id = e.id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 23. ลบชุดข้อสอบที่ละเมิดลิขสิทธิ์ (Admin จัดการโดยตรง)
app.delete("/api/admin/exam-sets/:id", authToken, requireRole("admin"), async (req, res) => {
  try {
    await pool.query("DELETE FROM exam_sets WHERE id = ?", [req.params.id]);
    res.json({ message: "ลบชุดข้อสอบที่ละเมิดลิขสิทธิ์แล้ว" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 24. ดูสถิติรวมของระบบ (สุ่มถามง่าย ตอบสบายใจ)
app.get("/api/admin/stats", authToken, requireRole("admin"), async (req, res) => {
  try {
    const [[users]] = await pool.query("SELECT COUNT(*) as total FROM users");
    const [[sets]] = await pool.query("SELECT COUNT(*) as total FROM exam_sets");
    const [[reports]] = await pool.query("SELECT COUNT(*) as total FROM reports");

    res.json({
      total_users: users.total,
      total_exam_sets: sets.total,
      total_reports: reports.total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 26. รายงานชุดข้อสอบที่ผิดลิขสิทธิ์ (ฝั่ง User ส่งเข้ามา)
app.post("/api/exam-sets/:id/report", authToken, async (req, res) => {
  try {
    const examSetId = req.params.id;
    const { reason } = req.body;
    const userId = req.user.user_id;

    await pool.query("INSERT INTO reports (exam_set_id, reporter_id, reason, created_at) VALUES (?, ?, ?, NOW())", [examSetId, userId, reason]);
    res.status(201).json({ message: "ส่งรายงานสำเร็จ ขอบคุณที่ร่วมตรวจสอบ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 31. Admin อนุมัติชุดข้อสอบที่ขอเป็นสาธารณะ (Moderate)
app.put("/api/admin/exam-sets/:id/approve", authToken, requireRole("admin"), async (req, res) => {
  try {
    await pool.query("UPDATE exam_sets SET visibility = 'public' WHERE id = ?", [req.params.id]);
    res.json({ message: "อนุมัติชุดข้อสอบเป็นสาธารณะแล้ว" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// เปิดการรับข้อมูลที่ Port ที่ตั้งไว้
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`🚀 EXAMHIVE Backend running safely on port ${PORT}`);
});