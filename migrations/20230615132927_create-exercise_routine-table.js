const routine = require("../seed-data/routine");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("exercise_routine", (table) => {
    table.increments("id").primary();
    table
      .integer("routine_id")
      .unsigned()
      .references("routine.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("exercise_id")
      .unsigned()
      .references("exercise.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
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
  return knex.schema.dropTable("exercise_routine");
};
