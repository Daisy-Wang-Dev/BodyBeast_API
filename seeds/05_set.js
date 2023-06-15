/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const setData = require("../seed-data/set");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("set").del();
  await knex("set").insert(setData);
};
