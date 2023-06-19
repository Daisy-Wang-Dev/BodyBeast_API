const knex = require("knex")(require("../knexfile"));

// Get all histories for a given user
const histories = async (req, res) => {
  try {
    const routineHistories = await knex("user")
      .join("routine", "routine.user_id", "=", "user.id")
      .where({ user_id: req.params.userId })
      .select(
        "routine.id",
        "routine.user_id",
        "routine.name",
        "routine.created_at"
      );
    res.status(200).json(routineHistories);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error getting routine histories for user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

// For a given user get a given routine details: exercises, reps and sets


module.exports = {
  histories,
};
