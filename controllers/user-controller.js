const knex = require("knex")(require("../knexfile"));

// Get single user
const single = async (req, res) => {
  try {
    const user = await knex("user")
      .select("id", "name", "user_name", "email", "date_of_birth")
      .where({ id: req.params.userId });
    if (user.length === 0) {
      return res.status(404).json({
        error: true,
        message: `User with ID: ${req.params.userId} is not found`,
      });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error getting user with ID: ${req.params.userId}`,
      detail: `${err.message}`,
    });
  }
};

// Create a new user
const addUser = async (req, res) => {
  try {
    const newUser = await knex("user").insert(req.body);
    const addedUser = await knex("user").select(
      "id",
      "name",
      "user_name",
      "email",
      "date_of_birth"
    )
    .where({
      id: newUser[0]
    });
    res.status(201).json(addedUser);
    
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `error creating new user: ${req.body.user_name}`,
      details: `${error.message}`,
    });
  }
};

module.exports = {
  single,
  addUser,
};
