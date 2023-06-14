/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const routineData = require("../seed-data/routine");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("routine").del();
  await knex("routine").insert(routineData);
};
