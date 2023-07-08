import { StatusCodes } from 'http-status-codes';
import { ControllerFunction, FakeStripeAPIProps, SingleOrderItemModel } from '../types';
import Product from '../models/Product';
import Order from '../models/Order';
import { BadRequestError, NotFoundError } from '../errors';
import { checkPermissions } from '../utils';

const fakeStripeAPI = async ({ amount, currency }: FakeStripeAPIProps) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
};

const createOrder: ControllerFunction = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
  
    if (!cartItems || cartItems.length < 1) {
      throw new BadRequestError('No cart items provided');
    }
    if (!tax || !shippingFee) {
      throw new BadRequestError('Please provide tax and shipping fee');
    }
  
    let orderItems: SingleOrderItemModel[] = [];
    let subtotal = 0;
  
    for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.product });
      if (!dbProduct) {
        throw new NotFoundError(
          `No product with id : ${item.product}`
        );
      }
      const { name, price, images, _id } = dbProduct;
      const singleOrderItem = {
        amount: item.amount,
        name,
        price,
        image: images[0],
        product: _id,
      };
      // add item to order
      orderItems = [...orderItems, singleOrderItem];
      // calculate subtotal
      subtotal += item.amount * price;
    }
    // calculate total
    const total = tax + shippingFee + subtotal;
    // get client secret
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: 'usd',
    });
  
    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.client_secret,
      user: req.user?.userId,
    });
  
    res
      .status(StatusCodes.CREATED)
      .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders: ControllerFunction = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder: ControllerFunction = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions({ requestUser: req.user, resourceUserId: order.user });
    res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders: ControllerFunction = async (req, res) => {
    const orders = await Order.find({ user: req.user?.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder: ControllerFunction = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
  
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions({ requestUser: req.user, resourceUserId: order.user });
  
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();
  
    res.status(StatusCodes.OK).json({ order });
};

export { createOrder, getAllOrders, getSingleOrder, getCurrentUserOrders, updateOrder }
