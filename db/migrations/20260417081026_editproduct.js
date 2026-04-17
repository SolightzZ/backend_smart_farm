/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("product_id").primary();
    table.string("product_name").notNullable();
    table.float("quantity").notNullable(); // float เพื่อใช้คำนวณ
    table.float("rai").notNullable(); // float สำหรับขนาดพื้นที่
    table.string("image").notNullable(); // เก็บ URL หรือ Path รูปภาพ

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
