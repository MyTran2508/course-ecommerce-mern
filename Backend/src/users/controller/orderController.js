const Order = require("../model/orderModel");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper");
const validateId = require("../../common/utils/validateId");
const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");
const {
  addList,
} = require("../../courses/controller/courseProgressController");

const add = asyncHandler(async (req, res) => {
  try {
    const orderItems = req?.body?.orderItems;
    const userId = req?.body?.user?.id;
    const savedOrder = await Order.create({
      orderItems: orderItems,
      orderStatus: req?.body?.orderStatus,
      shippingMethod: req?.body?.shippingMethod,
      totalPrice: req?.body?.totalPrice,
      user: userId,
    });

    addList(orderItems, userId);

    const response = ResponseMapper.toDataResponseSuccess(savedOrder);
    return res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const getAll = asyncHandler(async (req, res) => {
  try {
    const getAllOrder = await Order.find({});
    const response = ResponseMapper.toListResponseSuccess(getAllOrder);
    res.status(200).json(response);
  } catch (error) {
    throw new Error(error);
  }
});

const getById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req?.query?.id);
    const response = ResponseMapper.toDataResponseSuccess(order);
    return res.json(response);
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
});

module.exports = { add, getAll, getById };
