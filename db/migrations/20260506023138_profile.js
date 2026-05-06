/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("profile", (table) => {
    table.increments("profile_id");
    table.string("firstName", 100).notNullable();
    table.string("lastName", 100).notNullable();

    table
      .enum("gender", ["male", "female", "other"])
      .notNullable()
      .defaultTo("male");

    table.enum("role", ["user", "admin"]).notNullable().defaultTo("user");
    table.string("address").nullable();
    table.string("phone").nullable();
    table.string("email").notNullable().unique();
    table.timestamp("registerDate").defaultTo(knex.fn.now());
    table.timestamp("lastActive").nullable();
    table.string("avatar").nullable();
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
  return knex.schema.dropTable("profile");
};
