const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

class authController {
  // POST /login
  async getUserLogin(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "กรอกข้อมูลไม่ครบ",
        });
      }

      const user = await db("users").where({ username }).first();

      // user not found
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "username หรือ password ไม่ถูกต้อง",
        });
      }

      // compare hash
      const isMatch = await bcrypt.compare(
        username + password + user.email,
        user.password,
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "username หรือ password ไม่ถูกต้อง",
        });
      }

      // create token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return res.status(200).json({
        success: true,
        user: {
          user_id: user.user_id,
          username: user.username,
          lastname: user.lastname,
          role: user.role,
          zone: user.zone,
          phone: user.phone,
          email: user.email,
        },
        token,
      });
    } catch (err) {
      console.error("login error:", err);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // เปลี่ยนรหัสผ่าน
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { old_password, new_password } = req.body;

      const userId = Number(id);

      // validate id
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          message: "Invalid user id",
        });
      }

      // auth check
      if (!req.user || req.user.user_id !== userId) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // validate input type + required
      if (
        typeof old_password !== "string" ||
        typeof new_password !== "string" ||
        !old_password.trim() ||
        !new_password.trim()
      ) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ",
        });
      }

      // password length
      if (new_password.length < 6) {
        return res.status(400).json({
          message: "password ต้องอย่างน้อย 6 ตัว",
        });
      }

      // prevent reuse password
      if (old_password === new_password) {
        return res.status(400).json({
          message: "ห้ามใช้รหัสผ่านเดิม",
        });
      }

      // get user
      const user = await db("users")
        .where({ user_id: userId })
        .select("password")
        .first();

      if (!user) {
        return res.status(404).json({
          message: "ไม่พบ user",
        });
      }

      // compare password
      const isMatch = await bcrypt.compare(old_password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "รหัสผ่านเดิมไม่ถูกต้อง",
        });
      }

      // hash new password
      const hash = await bcrypt.hash(new_password, 10);

      // update
      await db("users").where({ user_id: userId }).update({ password: hash });

      return res.json({
        success: true,
        message: "เปลี่ยนรหัสผ่านสำเร็จ",
      });
    } catch (err) {
      console.error("changePassword error:", err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // ลงทะเบียน
  // ลงทะเบียน
  async signup(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "password ต้องอย่างน้อย 6 ตัว",
        });
      }

      // เช็ค email ซ้ำ
      const exists = await db("users")
        .where("email", email)
        .orWhere("username", username)
        .first();

      if (exists) {
        return res.status(409).json({
          message: "username หรือ email ซ้ำ",
        });
      }

      const hash = await bcrypt.hash(password, 10);

      const [id] = await db("users").insert({
        username,
        lastname: "",
        email,
        phone: "",
        role: "user",
        zone: "",
        password: hash,
        gender: "other",
      });

      return res.status(201).json({
        success: true,
        user_id: id,
      });
    } catch (err) {
      console.error("signup error:", err);

      return res.status(500).json({
        message: err.message,
        code: err.code,
      });
    }
  }
}

module.exports = new authController();
