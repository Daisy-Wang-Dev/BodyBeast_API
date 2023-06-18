const knex = require("knex")(require("../knexfile"));

// Validation
// If the userId existed
const isExistedId = async (req, res) => {
  const result = await knex("user").where({ id: req.params.userId }).first();

  if (!result) {
    return res.status(404).json({
      error: true,
      message: `Invalid request. User ID: ${req.params.userId} does not exist. Please provide a valid user ID`,
    });
  }
};

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
      message: `Error creating new user: ${req.body.user_name}`,
      details: `${err.message}`,
    });
  }
};

// Delete a current user
const remove = async (req, res) => {
  if (await isExistedId(req, res)) {
    return;
  }
  try {
    await knex("user").where({ id: req.params.userId }).del();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error deleting user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

// Update a current user
const update = async (req, res) => {
  
  try {
    await knex("user").where({ id: req.params.userId }).update(req.body);

    const updatedProfile = await knex("user")
      .select("id", "name", "user_name", "email", "date_of_birth", "mode")
      .where({ id: req.params.userId });
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: `Error updating user with ID: ${req.params.userId}`,
      details: `${err.message}`,
    });
  }
};

module.exports = {
  single,
  addUser,
  remove,
  update,
};
