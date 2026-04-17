/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("farms", (table) => {
    table.increments("farm_id").primary();
    table.string("farm_name").notNullable();
    table.json("location").notNullable(); // { "lat": 13.7, "lng": 100.5 }

    table.string("crop").notNullable(); // ชนิดพืช
    table.float("area_size").notNullable(); // เปลี่ยนเป็น float เพื่อคำนวณพื้นที่
    table.integer("sensor_count").defaultTo(0); // เปลี่ยนเป็น integer ค่าเริ่มต้นเป็น 0

    // เก็บค่า environment เป็น JSON (สะดวกสำหรับ Metadata)
    table.json("environment").notNullable();
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
