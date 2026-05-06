const bcrypt = require("bcrypt");
const db = require("../db");

class userController {
  // GET /users/:id
  async getUser(req, res) {
    try {
      const { id } = req.params;

      // validate id
      const userId = Number(id);
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          message: "Invalid user id",
        });
      }

      // query ก่อน (ให้ 404 มาก่อน)
      const user = await db("users").where({ user_id: userId }).first();

      if (!user) {
        return res.status(404).json({
          message: "ไม่พบ user",
        });
      }

      // ownership check
      if (req.user.user_id !== userId) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // sanitize
      const { password, ...safeUser } = user;

      return res.json({
        success: true,
        result: safeUser,
      });
    } catch (err) {
      console.error("getUser error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // GET /users - all
  async getUsers(req, res) {
    try {
      const users = await db("users").select("*");
      return res.json({
        success: true,
        result: users,
      });
    } catch (err) {
      console.err("Getusers: ", err);
      return res.status(500).json({ message: err.message });
    }
  }

  // POST /users - create
  async postCreateUser(req, res) {
    try {
      const { username, email, password, gender, phone } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ",
        });
      }

      const existUsername = await db("users").where({ username }).first();
      if (existUsername) {
        return res.status(409).json({
          message: "username นี้ถูกใช้แล้ว",
        });
      }

      const existEmail = await db("users").where({ email }).first();
      if (existEmail) {
        return res.status(409).json({
          message: "email นี้ถูกใช้แล้ว",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "password ต้องอย่างน้อย 6 ตัว",
        });
      }

      if (phone) {
        const existPhone = await db("users").where({ phone }).first();
        if (existPhone) {
          return res.status(409).json({
            message: "phone นี้ถูกใช้แล้ว",
          });
        }

        if (phone.length < 10) {
          return res.status(400).json({
            message: "phone ต้องอย่างน้อย 10 ตัว",
          });
        }
      }

      if (gender && gender !== "male" && gender !== "female") {
        return res.status(400).json({
          message: "gender ต้องเป็น male หรือ female",
        });
      }

      const hashpassword = await bcrypt.hash(password, 10);
      const [id] = await db("users").insert({
        username,
        email,
        password: hashpassword,
        gender: gender || null,
        phone: phone || null,
      });

      return res.status(201).json({
        success: true,
        user_id: {
          id,
          username,
          password,
          password: hashpassword,
          email,
          gender,
          phone,
        },
      });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "username หรือ email ซ้ำ",
        });
      }
      console.error("Postcreateuser: ", err);
      return res.status(500).json({ message: err.message });
    }
  }

  // PUT /users/:id
  async putUpdateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email } = req.body;

      // เช็ค user มีจริงไหม
      const user = await db("users").where({ user_id: id }).first();

      if (!user) {
        return res.status(404).json({ message: "ไม่พบ user" });
      }

      // เช็ค username ซ้ำ (แต่ไม่ใช่ตัวเอง)
      if (username) {
        const existUsername = await db("users")
          .where({ username })
          .whereNot({ user_id: id })
          .first();

        if (existUsername) {
          return res.status(409).json({
            message: "username นี้ถูกใช้แล้ว",
          });
        }
      }

      // เช็ค email ซ้ำ (เหมือนกัน)
      if (email) {
        const existEmail = await db("users")
          .where({ email })
          .whereNot({ user_id: id })
          .first();

        if (existEmail) {
          return res.status(409).json({
            message: "email นี้ถูกใช้แล้ว",
          });
        }
      }

      // update
      await db("users")
        .where({ user_id: id })
        .update({
          ...(username && { username }),
          ...(email && { email }),
        });

      return res.json({ success: true });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "username หรือ email ซ้ำ",
        });
      }
      console.err("Putupdateuser: ", err);
      return res.status(500).json({ message: err.message });
    }
  }

  // DELETE /users/:id
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // validate id
      const userId = Number(id);
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          message: "Invalid user id",
        });
      }

      // ownership check
      if (req.user.user_id !== userId) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      // delete
      const deleted = await db("users").where({ user_id: userId }).del();

      // check result
      if (!deleted) {
        return res.status(404).json({
          message: "ไม่พบ user",
        });
      }

      return res.json({
        success: true,
      });
    } catch (err) {
      console.error("deleteUser error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new userController();
