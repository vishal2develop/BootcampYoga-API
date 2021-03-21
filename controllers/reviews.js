const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

// @desc GET All Reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access public

exports.getReviews = asyncHandler(async (req, res, next) => {
  // If bootcamp id is provided in url -> fetch details for specific bootcamp
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId,
    });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    // Fetching all courses
    res.status(200).json(res.advancedResults);
  }
});

// @desc GET Single Review
// @route GET /api/v1/reviews/:id
// @access public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review found with the Id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Add a Review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access private

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc Update a Review
// @route PUT /api/v1/reviews/:id
// @access private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No Review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure the review belongs to the logged in user

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${review._id}`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Delete a Review
// @route DELETE /api/v1/reviews/:id
// @access private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No Review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure the review belongs to the logged in user

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete review ${review._id}`,
        401
      )
    );
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
