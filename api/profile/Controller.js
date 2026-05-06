const db = require("../db");

class profileController {
  // GET /profile - all
  async getProfile(req, res) {
    try {
      const profile = await db("profile").select("*");
      return res.json({
        success: true,
        result: profile,
      });
    } catch (error) {
      console.error("getProfile error: ", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async postCreateProfile(req, res) {
    try {
      const {
        firstName,
        lastName,
        gender,
        role,
        address,
        phone,
        email,
        avatar,
      } = req.body;
      if (!firstName) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ firstName",
        });
      }

      if (!lastName) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ lastName",
        });
      }

      if (!gender) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ gender",
        });
      }

      if (!role) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ role",
        });
      }

      if (!address) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ address",
        });
      }

      if (!phone) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ phone",
        });
      }

      if (!email) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ email",
        });
      }

      const existingEmail = await db("profile").where({ email }).first();
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "อีเมลนี้ถูกใช้งานไปแล้ว",
        });
      }

      if (!avatar) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ avatar",
        });
      }

      const [id] = await db("profile").insert({
        firstName,
        lastName,
        gender,
        role,
        address,
        phone,
        email,
        avatar,
      });
      return res.status(201).json({
        success: true,
        profile_id: {
          id,
          firstName,
          lastName,
          gender,
          role,
          address,
          phone,
          email,
          avatar,
        },
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ",
        });
      }

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "อีเมลนี้มีอยู่ในระบบแล้ว",
        });
      }
      console.error("postCreateProfile error: ", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new profileController();
