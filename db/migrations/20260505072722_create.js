/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id");

    table.string("username", 100).notNullable().unique().index();
    table.string("email", 150).notNullable().unique();
    table.string("password", 255).notNullable();

    table.enu("role", ["user", "admin"]).notNullable().defaultTo("user");

    table
      .enu("gender", ["male", "female", "other"])
      .nullable()
      .defaultTo("male");

    table.string("phone").nullable();

    table.timestamp("register_date").defaultTo(knex.fn.now());
    table.timestamp("last_active").nullable();

    table.text("address").nullable();

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
  return knex.schema.dropTable("users");
};
