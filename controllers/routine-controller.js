const routine = require("../seed-data/routine");

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
    console.log(userRoutine[0]);
    // Get exercises for a given routine (maybe a join with set)
    const exerciseInRoutine = await knex("routine")
      .join("exercise_routine", "exercise_routine.routine_id", "routine.id")
      .join("exercise", "exercise_routine.exercise_id", "=", "exercise.id")
      .join("set", "set.exercise_routine_id", "=", "exercise_routine.id")
      .select("exercise.name", "set.weight", "set.rep")
      .where({ user_id: req.params.userId })
      .where({ "routine.id": req.params.routineId });

    console.log(exerciseInRoutine);
       const response = {
        user_id: userRoutine[0]?.user_id,
        id: userRoutine[0]?.id,
        name: userRoutine[0]?.name,
        created_at: userRoutine[0]?.created_at,
        exercises: [],
      };

      const exerciseNames = Array.from(new Set(exerciseInRoutine.map((exercise) => exercise.name)));

      exerciseNames.forEach((name) => {
        const exerciseSets = exerciseInRoutine
          .filter((exercise) => exercise.name === name)
          .map((exercise) => ({ weight: exercise.weight, reps: exercise.rep }));
  
        response.exercises.push({ exercise_name: name, sets: exerciseSets });
      });
  
      res.status(200).json(response);

    // Insert an exercise key in the first object
    // let namesArr = [];
    // const names = exerciseInRoutine.map(({ name }) => name);
    // const filteredNames = exerciseInRoutine.filter(
    //   ({ name }, index) => !names.includes(name, index + 1)
    // );
    // filteredNames.forEach((filterName) => namesArr.push(filterName.name));

    // console.log(namesArr);

    // const namesObjs = namesArr.map(async (nameObj) => {
    //   return { exercise_name: nameObj };
    // });

    // console.log(namesObjs);

    // const details = await knex("user")
    //   .join("routine", "routine.user_id", "=", "user.id")
    //   .join(
    //     "exercise_routine",
    //     "exercise_routine.routine_id",
    //     "=",
    //     "routine.id"
    //   )
    //   .join("exercise", "exercise_routine.exercise_id", "=", "exercise.id")
    //   .join("set", "set.exercise_routine_id", "=", "exercise_routine.id")
    //   .select(
    //     "routine.user_id",
    //     "routine.id",
    //     "routine.created_at",
    //     "exercise.name",
    //     "set.weight",
    //     "set.rep"
    //   )
    //   .where({ user_id: req.params.userId })
    //   .andWhere({ routine_id: req.params.routineId });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error getting routine history details for user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

const test = async (req, res) => {
  try {
    testData = await knex("exercise").where({ id: req.params.exerciseId });
    res.status(200).json(testData);
  } catch (err) {}
};

module.exports = {
  histories,
  historyDetails,
  test,
};
