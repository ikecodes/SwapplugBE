const { Router } = require("express");
const auth = require("../middlewares/auth");
const orderController = require("../controllers/orderController");

const router = Router();

router.use(auth);

router.route("/getOutgoingOrders").get(orderController.getOutgoingOrders);
router.route("/getIncomingOrders").get(orderController.getIncomingOrders);
router.route("/").post(orderController.createOrder);
router.route("/:id").patch(orderController.updateOrder);
router.route("/:id").delete(orderController.deleteOrder);

module.exports = router;
