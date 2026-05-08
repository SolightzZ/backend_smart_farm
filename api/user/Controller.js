const bcrypt = require("bcrypt");
const db = require("../db");

class userController {
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

  // GET /users/:id
  async getUser(req, res) {
    try {
      const { id } = req.params;

      // validate id
      const userId = Number(id);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user id",
        });
      }

      // query user
      const user = await db("users").where({ user_id: userId }).first();

      // not found
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // remove password
      const { password, ...safeUser } = user;

      return res.status(200).json({
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

      const hashpassword = await bcrypt.hash(username + password + email, 10);
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

      const { username, lastname, email, phone, role, zone, gender } = req.body;

      // เช็ค user มีจริงไหม
      const user = await db("users").where({ user_id: id }).first();

      if (!user) {
        return res.status(404).json({
          message: "ไม่พบ user",
        });
      }

      // เช็ค username ซ้ำ
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

      // เช็ค email ซ้ำ
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

      if (phone) {
        // เช็ค phone ซ้ำ
        if (phone) {
          const existPhone = await db("users")
            .where({ phone })
            .whereNot({ user_id: id })
            .first();

          if (existPhone) {
            return res.status(409).json({
              message: "phone นี้ถูกใช้แล้ว",
            });
          }
        }
      }

      if (
        gender &&
        gender !== "male" &&
        gender !== "female" &&
        gender !== "other"
      ) {
        return res.status(400).json({
          message: "gender ต้องเป็น male, female หรือ other",
        });
      }

      if (role && role !== "user" && role !== "admin") {
        return res.status(400).json({
          message: "role ต้องเป็น user หรือ admin",
        });
      }

      // update
      await db("users").where({ user_id: id }).update({
        username,
        lastname,
        email,
        phone,
        role,
        zone,
        gender,
      });

      return res.json({
        success: true,
        user_id: {
          user_id: id,
          username,
          lastname,
          email,
          phone,
          role,
          zone,
          gender,
        },
      });
    } catch (err) {
      console.error("putUpdateUser:", err);

      return res.status(500).json({
        message: err.message,
      });
    }
  }

  // DELETE /users/:id
  async deleteUser(req, res) {
    try {
      const userId = Number(req.params.id);

      // validate id
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user id",
        });
      }

      // check user exists
      const user = await db("users").where({ user_id: userId }).first();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // delete user
      await db("users").where({ user_id: userId }).del();

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        result: { user_id: userId, username: user.username },
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
