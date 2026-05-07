const db = require("../db");

class editfarmController {
  // GET /editfarm - all
  async getEditfarm(req, res) {
    try {
      const editfarm = await db("farms").select("*");
      return res.json({
        success: true,
        result: editfarm,
      });
    } catch (error) {
      console.error("getEditfarm: ", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // POST /editfarm - create
  async postCreateEditfarm(req, res) {
    try {
      const {
        farm_name,
        location,
        crop,
        areaSize,
        sensorCount,
        deviceCount,
        environment,
      } = req.body;

      if (!farm_name) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ farm_name",
        });
      }

      if (!location) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ location",
        });
      }

      if (!crop) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ crop",
        });
      }

      if (!areaSize) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ areaSize",
        });
      }

      if (!sensorCount) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ sensorCount",
        });
      }

      if (!deviceCount) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ deviceCount",
        });
      }

      if (!environment) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ environment",
        });
      }

      const [id] = await db("farms").insert({
        farm_name,
        crop,
        areaSize,
        sensorCount,
        deviceCount,
        environment: JSON.stringify(environment),
        location: JSON.stringify(location),
      });

      return res.status(201).json({
        success: true,
        result: {
          id,
          farm_name,
          crop,
          areaSize,
          sensorCount,
          deviceCount,
          environment,
          location,
        },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "ชื่อ editfarm นี้ถูกใช้แล้ว",
        });
      }
      console.error("postCreateEditfarm: ", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async putUpdateEditfarm(req, res) {
    try {
      const { id } = req.params;

      const {
        farm_name,
        location,
        crop,
        areaSize,
        sensorCount,
        deviceCount,
        environment,
      } = req.body;

      if (!farm_name) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ farm_name",
        });
      }

      if (!location) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ location",
        });
      }

      if (!crop) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ crop",
        });
      }

      const updated = await db("farms")
        .where({ farm_id: id })
        .update({
          farm_name,
          crop,
          areaSize,
          sensorCount,
          deviceCount,
          environment: JSON.stringify(environment),
          location: JSON.stringify(location),
          updated_at: db.fn.now(),
        });

      // ไม่มีข้อมูลถูก update
      if (!updated) {
        return res.status(404).json({
          message: "ไม่พบฟาร์ม",
        });
      }

      return res.json({
        success: true,
        result: {
          farm_id: id,
          farm_name,
          crop,
          areaSize,
          sensorCount,
          deviceCount,
          environment,
          location,
        },
      });
    } catch (error) {
      console.error("putUpdateEditfarm:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new editfarmController();
