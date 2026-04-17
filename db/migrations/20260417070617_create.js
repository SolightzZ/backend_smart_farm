/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();
    table.string("username").notNullable().unique(); // ป้องกันชื่อซ้ำ unique
    table.string("email").notNullable().unique(); // ป้องกันอีเมลซ้ำ unique
    table.string("password").notNullable();

    // บางคนอาจไม่สะดวกระบุ nullable
    table.string("gender").nullable();
    table.string("phone").nullable();

    table.timestamp("register_date").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("last_active").nullable();

    table.string("role").notNullable().defaultTo("user"); // กำหนด default role เป็น user
    table.text("address").nullable();
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
  return knex.schema.dropTable("users");
};
