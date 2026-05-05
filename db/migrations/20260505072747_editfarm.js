/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("farms", (table) => {
    table.increments("farm_id");

    table.integer("user_id").unsigned().nullable();

    table.string("farm_name").notNullable();
    table.json("location").notNullable();

    table.string("crop").notNullable();

    table.decimal("area_size", 10, 2).notNullable();
    table.integer("sensor_count").defaultTo(0);

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
exports.down = function (knex) {
  return knex.schema.dropTable("farms");
};
