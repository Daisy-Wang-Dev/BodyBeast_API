const router = require("express").Router();
const userController = require("../controllers/user-controller");

router.route("/").post(userController.addUser);
router
  .route("/:userId")
  .get(userController.single)
  .delete(userController.remove);

module.exports = router;
