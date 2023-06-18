const knex = require("knex")(require("../knexfile"));

// For a given user get all routine histories
const histories = async (req, res) => {
  try {
    const routinehistories = await knex("user")
      .join("routine", "routine.user_id", "=", "user.id")
      .where({ user_id: req.params.userId })
      .select("routine.user_id", "routine.name", "routine.created_at");
    res.status(200).json(routinehistories);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error getting routine history for user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

module.exports = {
  histories,
};
