/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const exerciseData = require("../seed-data/exercise");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("exercise").del();
  await knex("exercise").insert(exerciseData);
};
