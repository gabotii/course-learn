const express = require("express");
const router = express.Router();
const invCont = require("../controllers/inventory-controller");
const utilities = require("../utilities");

// Static Routes
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "/public/css"));
router.use("/js", express.static(__dirname + "/public/js"));
router.use("/images", express.static(__dirname + "/public/images"));

// Route for inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId));

// Route for inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invCont.buildByInventoryId));

// Route to trigger intentional error
router.get("/trigger-error", utilities.handleErrors(invCont.triggerError));

module.exports = router;