import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

import ApiError from "../utils/ApiError.js";

const updateProductRating = async (productId) => {

  const reviews = await Review.find({
    product: productId,
    isDeleted: false,
    isApproved: true,
  });

  const totalReviews = reviews.length;

  let averageRating = 0;

  if (totalReviews > 0) {

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    averageRating = totalRating / totalReviews;

  }

  await Product.findByIdAndUpdate(
    productId,
    {
      averageRating,
      totalReviews,
    }
  );

};
export const createReview = async (
  userId,
  body,
  files
) => {

  const {
    product,
    rating,
    title,
    comment,
  } = body;

  const productExists =
    await Product.findOne({
      _id: product,
      isDeleted: false,
    });

  if (!productExists) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  const order =
    await Order.findOne({
      user: userId,
      orderStatus: "delivered",
      "items.product": product,
    });

  if (!order) {
    throw new ApiError(
      400,
      "Purchase required before review"
    );
  }

  const alreadyReviewed =
    await Review.findOne({
      user: userId,
      product,
      isDeleted: false,
    });

  if (alreadyReviewed) {
    throw new ApiError(
      400,
      "Review already submitted"
    );
  }

  const images = [];

  if (files?.length) {

    for (const file of files) {

      const uploaded =
        await uploadFile(
          file,
          "reviews"
        );

      images.push({
        fileId: uploaded.fileId,
        url: uploaded.url,
      });

    }

  }

  const review =
    await Review.create({

      product,

      user: userId,

      rating,

      title,

      comment,

      images,

      isVerifiedPurchase: true,

    });

  await updateProductRating(product);

  return review;

};
export const getProductReviews =
  async (productId) => {

    return await Review.find({

      product: productId,

      isDeleted: false,

      isApproved: true,

    })

      .populate(
        "user",
        "name avatar"
      )

      .sort({
        createdAt: -1,
      });

};
export const updateReview = async (
  userId,
  reviewId,
  body
) => {

  const review =
    await Review.findOne({

      _id: reviewId,

      user: userId,

      isDeleted: false,

    });

  if (!review) {
    throw new ApiError(
      404,
      "Review not found"
    );
  }

  Object.assign(review, body);

  await review.save();

  await updateProductRating(
    review.product
  );

  return review;

};
export const deleteReview = async (
  userId,
  reviewId
) => {

  const review =
    await Review.findOne({

      _id: reviewId,

      user: userId,

      isDeleted: false,

    });

  if (!review) {

    throw new ApiError(
      404,
      "Review not found"
    );

  }

  review.isDeleted = true;

  await review.save();

  await updateProductRating(
    review.product
  );

  return true;

};