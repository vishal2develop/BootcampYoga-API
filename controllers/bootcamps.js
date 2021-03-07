const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const geoCoder = require("../utils/geocoder");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const allBootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: allBootcamps.length,
    data: allBootcamps,
  });
});

// @desc Get Bootcamp by id
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  // in case of an correctly formatted id status returned may be 200 - success
  // but object with that id may not exist in our db. So checking if bootcamp is returned or not
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc Create a new Bootcamp
// @route POST /api/v1/bootcamps/
// @access public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const newBootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: newBootcamp,
  });
});

// @desc Update a Bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // if false doesnt update previous data
    runValidators: true, // run schema validation on new data
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc Delete a Bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!deletedBootcamp) {
    return next(
      new ErrorResponse(`Resource not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc Get bootcamps within a radius
// @route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // Get lat/lng from geocoder
  const loc = await geoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide distance by radius of earth
  // Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
