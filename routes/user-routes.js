const router = require("express").Router();
const userController = require("../controllers/user-controller");
const routineController = require("../controllers/routine-controller");

router.route("/").post(userController.addUser);
router
  .route("/:userId")
  .get(userController.single)
  .put(userController.update)
  .delete(userController.remove);

router.route("/:userId/routine").get(userController.routines);

router.route("/:userId/history").get(routineController.histories);

router.route("/:userId/history/:routineId").get(routineController.historyDetails)


module.exports = router;
