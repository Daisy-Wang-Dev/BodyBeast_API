const routine = require("../seed-data/routine");

const knex = require("knex")(require("../knexfile"));

// Get all routines for a give user
const routines = async (req, res) => {
  try {
    const userRoutines = await knex("user")
      .join("routine", "routine.user_id", "=", "user.id")
      .select(
        "routine.user_id",
        "routine.id",
        "routine.name",
        "routine.created_at"
      )
      .where({ user_id: req.params.userId })
      .andWhere((qb) => {
        qb.where(
          "routine.created_at",
          "=",
          knex("routine")
            .max("created_at")
            .where({ user_id: req.params.userId })
        );
      });

    res.status(200).json(userRoutines);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error getting routines for user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

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
        knex.raw("DATE_FORMAT(routine.created_at, '%Y-%m-%d') AS created_at")
      )
      .orderBy("routine.created_at", "desc")
      ;
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
const historyDetails = async (req, res) => {
  try {
    // First get routine for a given user
    const userRoutine = await knex("user")
      .join("routine", "routine.user_id", "=", "user.id")
      .select(
        "routine.user_id",
        "routine.id",
        "routine.name",
        knex.raw("DATE_FORMAT(routine.created_at, '%Y-%m-%d') AS created_at")
      )
      .where({ user_id: req.params.userId });

    // Get exercises for a given routine
    const exerciseInRoutine = await knex("routine")
      .join("exercise_routine", "exercise_routine.routine_id", "routine.id")
      .join("exercise", "exercise_routine.exercise_id", "=", "exercise.id")
      .join("set", "set.exercise_routine_id", "=", "exercise_routine.id")
      .select(
        "exercise.name",
        "set.weight",
        "set.rep",
        knex.raw("(set.weight * set.rep) AS volume")
      )
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
        .map((exercise) => ({
          weight: exercise.weight,
          reps: exercise.rep,
          volume: exercise.volume,
        }));

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

// Get all exercises for a given routine of a given user
const exercises = async (req, res) => {
  if (!req.params.routineId) {
    return res.status(404).json({
      error: true,
      message: `No routine found with ID ${req.params.routineId}`,
    });
  }
  try {
    const userRoutine = await knex("user")
      .join("routine", "routine.user_id", "=", "user.id")
      .select("routine.user_id", "routine.id", "routine.name")
      .where({ user_id: req.params.userId })
      .where({ "routine.id": req.params.routineId });

    const exerciseInRoutine = await knex("exercise_routine")
      .join("exercise", "exercise_routine.exercise_id", "=", "exercise.id")
      .select("exercise.id", "exercise.name")
      .where({ "exercise_routine.routine_id": req.params.routineId });

    const exercises = exerciseInRoutine.map((exercise) => exercise.name);

    const response = {
      user_id: req.params.userId,
      id: req.params.routineId,
      name: userRoutine[0].name,
      exercises,
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error getting exercises in this routine for user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

// Post completed routine and all exercise details as new entries
const newCompletedRoutine = async (req, res) => {
  const {userId} = req.params;
  if (!userId) {
    return res.status(404).json({
      error: true,
      message: `No user found with ID ${userId}`,
    });
  }

  try {
    await knex.transaction(async (trx) => {
      const { routineName, exercises } = req.body;

      // Insert new completed routine entry and get its id with array destructuring
      const [routineId] = await trx("routine").insert({
        name: routineName,
        user_id: userId,
      });
     
      // For each exercise_name, get exercise id
      for (const exercise of exercises) {
        const [exerciseId] = await trx("exercise").insert({
          name: exercise.exercise_name,
        });
       
       const[exerciseRoutineId] = await trx("exercise_routine").insert({
          exercise_id: exerciseId,
          routine_id: routineId,
        });

        for (const set of exercise.sets) {
          await trx("set").insert({ weight: set.weight, rep: set.reps, exercise_routine_id: exerciseRoutineId});
        }
      }
      await trx.commit();
      res.status(200).json({message:"Routine is successfully completed"})
    });
  } catch (err) {
    trx.rollback();
    res.status(500).json({
      error: true,
      message: `Error posting this routine for user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

module.exports = {
  routines,
  histories,
  historyDetails,
  exercises,
  newCompletedRoutine,
};
