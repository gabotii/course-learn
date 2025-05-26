const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator");

const inventoryController = {};

/* ***************************
 * Build management view (Task 1)
 * ************************** */
inventoryController.getManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } catch (error) {
    error.status = 500;
    error.message = "Failed to load management view.";
    next(error);
  }
};

/* ***************************
 * Build add classification view (Task 2)
 * ************************** */
inventoryController.getAddClassificationView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: '',
    });
  } catch (error) {
    error.status = 500;
    error.message = "Failed to load add classification view.";
    next(error);
  }
};

/* ***************************
 * Process add classification (Task 2)
 * ************************** */
inventoryController.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("notice", "Failed to add classification.");
      return res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        errors: errors.array(),
        classification_name,
      });
    }

    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("notice", "Classification added successfully!");
      const updatedNav = await utilities.getNav();
      return res.render("inventory/management", {
        title: "Inventory Management",
        nav: updatedNav,
      });
    } else {
      req.flash("notice", "Failed to add classification.");
      res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        errors: null,
        classification_name,
      });
    }
  } catch (error) {
    error.status = 500;
    error.message = "Failed to process classification addition.";
    next(error);
  }
};

/* ***************************
 * Build add inventory view (Task 3)
 * ************************** */
inventoryController.getAddInventoryView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      errors: null,
      formData: {},
    });
  } catch (error) {
    error.status = 500;
    error.message = "Failed to load add inventory view.";
    next(error);
  }
};

/* ***************************
 * Process add inventory (Task 3)
 * ************************** */
inventoryController.addInventory = async function (req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("notice", "Failed to add inventory item.");
      return res.render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav: await utilities.getNav(),
        classificationList,
        errors: errors.array(),
        formData: req.body,
      });
    }

    const result = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });

    if (result) {
      req.flash("notice", "Inventory item added successfully!");
      return res.render("inventory/management", {
        title: "Inventory Management",
        nav: await utilities.getNav(),
      });
    } else {
      req.flash("notice", "Failed to add inventory item.");
      res.render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav: await utilities.getNav(),
        classificationList,
        errors: null,
        formData: req.body,
      });
    }
  } catch (error) {
    error.status = 500;
    error.message = "Failed to process inventory addition.";
    next(error);
  }
};

/* ***************************
 * Build new cars view (Placeholder for New Cars link)
 * ************************** */
inventoryController.getNewCarsView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/new-cars", {
      title: "Vehicle Management",
      nav,
    });
  } catch (error) {
    error.status = 500;
    error.message = "Failed to load new cars view.";
    next(error);
  }
};

/* ***************************
 * Build inventory by classification view (existing)
 * ************************** */
inventoryController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    
    if (!data || data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "Error",
        message: "No vehicles found for this classification.",
        nav,
      });
    }

    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
};

/* ***************************
 * Build inventory detail view (existing)
 * ************************** */
inventoryController.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryByInvId(inv_id);
    const detail = await utilities.buildInventoryDetail(data);
    const nav = await utilities.getNav();
    if (!data) {
      return res.status(404).render("errors/error", {
        title: "Error",
        message: "Vehicle not found.",
        nav,
      });
    }
    const makeModel = `${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/detail", {
      title: makeModel,
      nav,
      detail,
    });
  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
};

/* ***************************
 * Trigger intentional error (existing)
 * ************************** */
inventoryController.triggerError = async function (req, res, next) {
  try {
    const error = new Error("Intentional server error for testing purposes");
    error.status = 500;
    throw error;
  } catch (error) {
    next(error);
  }
};

module.exports = inventoryController;