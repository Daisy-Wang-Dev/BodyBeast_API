const router = require("express").Router();
const userController = require("../controllers/user-controller");

router
    .route("/:userId")
    .get(userController.single)

module.exports = router;