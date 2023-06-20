const knex = require("knex")(require("../knexfile"));

const exerciseData = async (req, res) => {
    // For a given user get a given routine details: exercises, reps and sets
const historyDetails = async (req, res) => {
    try {
      // First get routine for a given user
      const userRoutine = await knex("user")
        .join("routine", "routine.user_id", "=", "user.id")
        .select(
          "routine.user_id",
          "routine.id",
          "routine.name",
          "routine.created_at"
        )
        .where({ user_id: req.params.userId });
  
      // Get exercises for a given routine 
      const exerciseInRoutine = await knex("routine")
        .join("exercise_routine", "exercise_routine.routine_id", "routine.id")
        .join("exercise", "exercise_routine.exercise_id", "=", "exercise.id")
        .join("set", "set.exercise_routine_id", "=", "exercise_routine.id")
        .select("exercise.name", "set.weight", "set.rep")
        .where({ user_id: req.params.userId })
        .where({ "routine.id": req.params.routineId });
  
      const response = {
        user_id: userRoutine[0]?.user_id,
        id: userRoutine[0]?.id,
        name: userRoutine[0]?.name,
        created_at: userRoutine[0]?.created_at,
        exercises: [],
      };
  
      // Return an array of unique names
      const exerciseNames = Array.from(
        new Set(exerciseInRoutine.map((exercise) => exercise.name))
      );
  
      // Get weights and reps for each exercise
      exerciseNames.forEach((name) => {
        const exerciseSets = exerciseInRoutine
          .filter((exercise) => exercise.name === name)
          .map((exercise) => ({ weight: exercise.weight, reps: exercise.rep }));
  
        response.exercises.push({ exercise_name: name, sets: exerciseSets });
      });
  
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({
        error: true,
        message: `Error getting routine history details for user with ID: ${req.params.userId}`,
        details: `${err.message}`,
      });
    }
  };
}



module.exports = {
   
  };