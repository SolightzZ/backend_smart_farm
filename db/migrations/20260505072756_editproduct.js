/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("product_id");

    table.string("product_name").notNullable();

    table.decimal("quantity", 10, 2).notNullable();
    table.decimal("rai", 10, 2).notNullable();
    table.string("image").notNullable();

    // บันทึกเวลาปัจจุบัน
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
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
