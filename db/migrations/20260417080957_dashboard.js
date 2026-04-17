/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("dashboard", (table) => {
    table.increments("dashboard_id").primary();
    table.string("dashboard_name").notNullable();
    table.float("temperature").notNullable();
    table.float("humidity").notNullable();
    table.float("ph").notNullable();

    table.timestamp("time").defaultTo(knex.raw("CURRENT_TIMESTAMP")); // บันทึกเวลาปัจจุบันให้อัตโนมัติ

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
