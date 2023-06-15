/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const exerciseRoutineData = require("../seed-data/exercise-routine");
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("exercise_routine").del()
  await knex("exercise_routine").insert(exerciseRoutineData
  );
};
