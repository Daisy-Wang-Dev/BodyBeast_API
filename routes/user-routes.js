const router = require("express").Router();
const userController = require("../controllers/user-controller");

router.route("/").post(userController.addUser);
router.route("/:userId").get(userController.single);

module.exports = router;
