const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc GET All Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public

exports.getCourses = asyncHandler(async (req, res, next) => {
  // If bootcamp id is provided in url -> fetch details for specific bootcamp
  if (req.params.bootcampId) {
    const courses = await Course.find({
      bootcamp: req.params.bootcampId,
    });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    // Fetching all courses
    res.status(200).json(res.advancedResults);
  }
});

// @desc GET Single Courses
// @route GET /api/v1/courses/:id
// @access public

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Add a Course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private

exports.addCourse = asyncHandler(async (req, res, next) => {
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

  // Make sure the bootcamp owner is the current logged in user

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc Update Course
// @route PUT /api/v1/courses/:id
// @access private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is course owner

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        404
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Delete Course
// @route DELETE /api/v1/courses/:id
// @access private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        404
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
