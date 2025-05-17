const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name; // Safe access to avoid errors
  if (!className) {
    return res.status(404).render("index", {
      title: "Not Found",
      nav,
      message: "No vehicles found for this classification.",
    });
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

module.exports = invCont;