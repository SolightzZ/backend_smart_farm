const db = require("../db");

class dashboardController {
  // GET /dashboard - all
  async getDashboard(req, res) {
    try {
      const dashboard = await db("dashboard").select("*");
      return res.json({ success: true, result: dashboard });
    } catch (error) {
      console.error("getDashboard error: ", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // POST /dashboard - create
  async postCreateDashboard(req, res) {
    try {
      const { farm_id, farm_name, temperatures, humidity, ph } = req.body;

      if (!farm_id) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ farm_id",
        });
      }

      if (!farm_name) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ farm_name",
        });
      }

      if (!temperatures) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ temperatures",
        });
      }

      if (!humidity) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ humidity",
        });
      }

      if (!ph) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ ph",
        });
      }

      const [id] = await db("dashboard").insert({
        farm_id,
        farm_name,
        temperatures,
        humidity,
        ph,
      });

      return res.status(201).json({
        success: true,
        result: { id, farm_name, farm_id, temperatures, humidity, ph },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "ชื่อ dashboard นี้ถูกใช้แล้ว",
        });
      }
      console.error("postCreateDashboard: ", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new dashboardController();
