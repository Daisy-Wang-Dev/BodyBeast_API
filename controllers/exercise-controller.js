const knex = require("knex")(require("../knexfile"));

// Get all exercise volume metric
const exerciseData = async (req, res) => {
  try {
    // First get all exercises for a given user
    const exercises = await knex("exercise")
      .join(
        "exercise_routine",
        "exercise_routine.exercise_id",
        "=",
        "exercise.id"
      )
      .join("routine", "exercise_routine.routine_id", "=", "routine.id")
      .join("user", "routine.user_id", "=", "user.id")
      .select("exercise.name")
      .groupBy("exercise.id")
      .where({ user_id: req.params.userId });

    // Get volume data for each exercise
    const exerciseData = await Promise.all(
      exercises.map(async (exercise) => {
        const exerciseVolume = await knex("set")
          .join(
            "exercise_routine",
            "exercise_routine.id",
            "=",
            "set.exercise_routine_id"
          )
          .join("routine", "routine.id", "=", "exercise_routine.routine_id")
          .join("exercise", "exercise.id", "=", "exercise_routine.exercise_id")
          .join("user", "user.id", "=", "routine.user_id")
          .select(
            knex.raw("SUM(set.weight * set.rep) AS total_volume"),
            knex.raw("DATE_FORMAT(routine.created_at, '%Y-%m-%d') AS created_at")
          )
          .groupBy("routine.created_at")
          .where({ user_id: req.params.userId })
          .andWhere("exercise.name", exercise.name);

        return { exercise_name: exercise.name, volume_data: exerciseVolume};
      })
    );
    res.status(200).json(exerciseData);

  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error getting exercise data for user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

module.exports = {
  exerciseData,
};
