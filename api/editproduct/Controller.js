const db = require("../db");

class editProductController {
  // GET /editproduct - all
  async getEditproduct(req, res) {
    try {
      const product = await db("products").select("*");
      return res.json({
        success: true,
        result: product,
      });
    } catch (error) {
      console.error("getEditproduct: ", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // POST /editproduct - create
  async postCreateEditproduct(req, res) {
    try {
      const { product_name, quantity, rai, image } = req.body;
      if (!product_name) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ product_name",
        });
      }

      if (!quantity) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ quantity",
        });
      }

      if (!rai) {
        return res.status(400).json({
          message: "กรอกข้อมูลไม่ครบ rai",
        });
      }

      const [id] = await db("products").insert({
        product_name,
        quantity,
        rai,
        image,
      });

      return res.status(201).json({
        success: true,
        result: { id, product_name, quantity, rai, image },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "ชื่อ editproduct นี้ถูกใช้แล้ว",
        });
      }
      console.error("postCreateEditproduct: ", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new editProductController();
