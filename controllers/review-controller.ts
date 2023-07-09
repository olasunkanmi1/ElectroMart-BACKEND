import { StatusCodes } from 'http-status-codes';
import { ControllerFunction } from '../types';
import Product from '../models/Product';
import Review from '../models/Review';
import { BadRequestError, NotFoundError } from '../errors';
import { checkPermissions } from '../utils';

// create review
const createReview: ControllerFunction = async (req, res) => {
    const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    createdBy: req.user?.userId,
  });

  if (alreadySubmitted) {
    throw new BadRequestError(
      'Already submitted review for this product'
    );
  }

  req.body.createdBy = req.user?.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
  
// get all reviews
const getAllReviews: ControllerFunction = async (req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name brand price',
    });

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

// get single review
const getSingleReview: ControllerFunction = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId }).populate('createdBy')
    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions({ requestUser: req.user, resourceUserId: review.createdBy._id });
    res.status(StatusCodes.OK).json({ review });
};

// update review
const updateReview: ControllerFunction = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions({ requestUser: req.user, resourceUserId: review.createdBy });

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

// delete review
const deleteReview: ControllerFunction = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOneAndDelete({ _id: reviewId });
    if (!review) {
        throw new NotFoundError(`No review with id ${reviewId}`);
    }
    checkPermissions({ requestUser: req.user, resourceUserId: review.createdBy });

    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
};

// get single product reviews
const getSingleProductReviews: ControllerFunction = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export { createReview, getAllReviews, getSingleReview, updateReview, deleteReview, getSingleProductReviews }