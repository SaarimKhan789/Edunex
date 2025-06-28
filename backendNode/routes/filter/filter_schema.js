// routes/filters/filter_schema.js
const express = require("express");
const router = express.Router();

const { filteredCourses } = require("../../controllers/filterSchema");
const { getUniqueValues } = require("../../controllers/filterSchema");
const { getOfferingTypes } = require("../../controllers/offeringTypes");
// const { filter } = require("../../controllers/filterSchema");

router.post("/filtered-courses", filteredCourses);
router.get("/unique-values", getUniqueValues);
router.get("/offering-types", getOfferingTypes);
// router.post("/filter-args", filter);

module.exports = router;
