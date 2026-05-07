/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("dashboard", (table) => {
    table.increments("dashboard_id");

    table.integer("farm_id").unsigned().nullable();
    table.string("farm_name").notNullable().index();

    table.decimal("temperatures", 5, 2).notNullable();
    table.decimal("humidity", 5, 2).notNullable();
    table.decimal("ph", 4, 2).notNullable();

    table.timestamp("time").defaultTo(knex.fn.now());

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
  return knex.schema.dropTable("dashboard");
};
