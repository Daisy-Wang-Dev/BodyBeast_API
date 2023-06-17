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

// Register a new user
const addUser = async (req, res) => {
  const { name, user_name, email, password, date_of_birth, mode } = req.body;

  if (!name || !user_name || !email || !password || !date_of_birth || !mode) {
    return res.status(400).send("Please enter the required fields.");
  }

  const newUserData = {
    name,
    user_name,
    email,
    password,
    date_of_birth,
    mode,
  };

  try {
    const newUser = await knex("user").insert(newUserData);
    const addedUser = await knex("user")
      .select(
        "id",
        "name",
        "user_name",
        "email",
        "password",
        "date_of_birth",
        "mode"
      )
      .where({
        id: newUser[0],
      });
    res.status(201).json(addedUser[0]);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `error creating new user: ${req.body.user_name}`,
      details: `${err.message}`,
    });
  }
};

const remove = async (req, res) => {
  try {
    await knex("warehouses").where({ id: req.params.userId }).del();
    res
      .status(204)
      .send(
        "Your account has been deleted. We're looking forward to seeing you back"
      );
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `error deleting user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

module.exports = {
  single,
  addUser,
};
