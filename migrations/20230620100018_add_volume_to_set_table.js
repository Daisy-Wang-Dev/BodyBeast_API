/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("set", (table) => {
      table.integer("volume");
    }).then(() => {
      return knex.raw(
        "UPDATE `set` SET `volume` = `weight` * `rep`"
      );
    }).catch((error) => {
        console.error("Migration failed:", error);
        throw error;
      });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("set", (table) => {
      table.dropColumn("volume");
    });
  };
