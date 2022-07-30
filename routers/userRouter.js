const { Router } = require("express");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const AuthController = require("../controllers/authController");
const UserController = require("../controllers/userController");
const upload = require("../services/multer");

const router = Router();

router.route("/").post(upload.single("companyCac"), AuthController.signup);
router.route("/session").post(AuthController.login);
router.route("/sendEmail").post(AuthController.reSendEmail);
router.route("/confirmEmail").post(AuthController.confirmEmail);
router.route("/forgotPassword").post(AuthController.forgotPassword);
router.route("/passwordResetConfirm").post(AuthController.passwordResetConfirm);
router.route("/resetPassword").patch(AuthController.resetPassword);

router.use(auth);
router.route("/me").get(AuthController.getMe);
router.route("/getWallet").get(AuthController.getWallet);

router
  .route("/uploadId")
  .patch(upload.single("identityCard"), AuthController.uploadId);
router.route("/updateMe").patch(AuthController.updateMe);
router
  .route("/updatePhoto")
  .patch(upload.single("photo"), AuthController.updatePhoto);
router.route("/updatePassword").patch(AuthController.updatePassword);

router.route("/getUser/:id").get(UserController.getUser);
router.route("/getUserStats").get(UserController.getUserStats);
router.route("/followUser/:id").patch(UserController.followUser);
router.route("/unfollowUser/:id").patch(UserController.unfollowUser);
router.route("/deactivateMe").patch(UserController.deactivateMe);

router.use(role("admin"));
router.route("/").get(UserController.getAllUsers);
router.route("/:id").get(UserController.getUser);
router.route("/verifyUser/:id").patch(UserController.verifyUser);
router.route("/activeStatus/:id").patch(UserController.activeStatus);

module.exports = router;
