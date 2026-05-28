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
    await pool.query(
      "INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)",
      [email, password_hash, display_name]
    );
    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
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
      { expiresIn: "2h" }
    );
    res.json({ token, role: user.role, display_name: user.display_name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// หมวด B — Exam Set CRUD & คลังสาธารณะ (ฟังก์ชัน #4, #5, #7, #8, #25, #30)
// ==========================================

// 4. สร้างชุดข้อสอบ
app.post("/api/exam-sets", authToken, async (req, res) => {
  try {
    const { title, description, subject_id } = req.body;
    const creator_id = req.user.user_id;

    const [result] = await pool.query(
      "INSERT INTO exam_sets (title, description, subject_id, creator_id, visibility) VALUES (?, ?, ?, ?, 'private')",
      [title, description, subject_id, creator_id]
    );
    res.status(201).json({ message: "สร้างชุดข้อสอบสำเร็จ", exam_set_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5, 25, 30. ดูรายการชุดข้อสอบ (ของตัวเอง + กรองตามสาธารณะ/วิชา)
app.get("/api/exam-sets", authToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { visibility, subject_id } = req.query;

    let query = "SELECT * FROM exam_sets WHERE (creator_id = ? OR visibility = 'public')";
    let params = [userId];

    if (visibility === "public") {
      query = "SELECT * FROM exam_sets WHERE visibility = 'public'";
      params = [];
    }
    if (subject_id) {
      query += (params.length > 0 ? " AND" : " WHERE") + " subject_id = ?";
      params.push(subject_id);
    }

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
    const [questions] = await pool.query("SELECT * FROM questions WHERE exam_set_id = ? ORDER BY `order` ASC", [examSetId]);
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
  try {
    const { title, description, visibility, license_tag } = req.body;
    const examSetId = req.params.id;
    const userId = req.user.user_id;

    const [check] = await pool.query("SELECT creator_id FROM exam_sets WHERE id = ?", [examSetId]);
    if (!check[0] || check[0].creator_id !== userId) return res.status(403).json({ message: "คุณไม่มีสิทธิ์แก้ไขชุดข้อสอบนี้" });

    // หากส่งขอเป็น public จะปรับสเตตัสเป็น pending เพื่อรอแอดมินอนุมัติก่อนตาม Concept
    const finalVisibility = visibility === "public" ? "pending" : (visibility || "private");

    await pool.query(
      "UPDATE exam_sets SET title = COALESCE(?, title), description = COALESCE(?, description), visibility = ?, license_tag = COALESCE(?, license_tag) WHERE id = ?",
      [title, description, finalVisibility, license_tag, examSetId]
    );
    res.json({ message: "อัปเดตชุดข้อสอบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 8. ลบชุดข้อสอบ (เฉพาะเจ้าของ)
app.delete("/api/exam-sets/:id", authToken, async (req, res) => {
  try {
    const examSetId = req.params.id;
    const userId = req.user.user_id;

    const [check] = await pool.query("SELECT creator_id FROM exam_sets WHERE id = ?", [examSetId]);
    if (!check[0] || check[0].creator_id !== userId) return res.status(403).json({ message: "คุณไม่มีสิทธิ์ลบชุดข้อสอบนี้" });

    await pool.query("DELETE FROM exam_sets WHERE id = ?", [examSetId]);
    res.json({ message: "ลบชุดข้อสอบเรียบร้อยแล้ว" });
  } catch (err) {
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
    const { type, stem, order, choices } = req.body; // choices = [{ text, is_correct }]

    const [qResult] = await pool.query(
      "INSERT INTO questions (exam_set_id, type, stem, `order`) VALUES (?, ?, ?, ?)",
      [examSetId, type, stem, order]
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
    const { stem, order } = req.body;
    await pool.query("UPDATE questions SET stem = COALESCE(?, stem), `order` = COALESCE(?, `order`) WHERE id = ?", [stem, order, req.params.id]);
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
    const [questions] = await pool.query("SELECT id, type, stem, `order` FROM questions WHERE exam_set_id = ? ORDER BY `order` ASC", [examSetId]);
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

// 16. ดูประวัติคะแนนย้อนหลัง (attempt history) ของผู้ใช้นั้น ๆ
app.get("/api/me/attempts", authToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await pool.query(
      "SELECT a.*, e.title as exam_title FROM attempts a JOIN exam_sets e ON a.exam_set_id = e.id WHERE a.user_id = ? ORDER BY a.finished_at DESC",
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

    await pool.query("INSERT INTO reports (exam_set_id, user_id, reason, created_at) VALUES (?, ?, ?, NOW())", [examSetId, userId, reason]);
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
const PORT = process.env.PORT || 8025;
app.listen(PORT, () => {
  console.log(`🚀 EXAMHIVE Backend running safely on port ${PORT}`);
});