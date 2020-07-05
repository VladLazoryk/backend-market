const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');


router.get('/', checkAuth, OrdersController.get_all);



router.get('/:orderId', checkAuth, OrdersController.get_order);



router.post('/', checkAuth, OrdersController.create_order);

router.delete('/:orderId', checkAuth, OrdersController.delete_order);

module.exports = router;
