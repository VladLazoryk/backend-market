const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => ({
          product: doc.product,
          quantity: doc.quantity,
          orderId: doc._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`,
          },
        })),
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order: {
          product: order.product,
          quantity: order.quantity,
          _id: order._id,
        },
        request: {
          message: 'Get all orders',
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_order = (req, res, next) => {
  Product.findById(req.body.productId).then(product => {
    if (!product) {
      return res.status(500).json({
        message: 'Product not found',
      });
    }
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });
    order
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Order successfully created',
          createdOrder: {
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${result._id}`,
          },
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
};

exports.delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order successfully deleted',
        request: {
          message: 'Create a new order',
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: {
            productId: 'ID',
            quantity: 'Number',
          },
        },
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};
