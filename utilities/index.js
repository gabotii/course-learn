const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************ */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications();
    if (!data || !data.rows) {
      throw new Error("No classification data returned from database.");
    }
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    // Add "New Cars" link only once
    list += '<li><a href="/inv/new-cars" title="View new cars">Custom</a></li>';
    if (data.rows && data.rows.length > 0) {
      // Use a Set to avoid duplicates in classification names
      const uniqueClassifications = [...new Set(data.rows.map(row => row.classification_name))];
      uniqueClassifications.forEach((classification_name) => {
        // Skip "New Cars" since it's already added
        if (classification_name !== "New Cars") {
          const row = data.rows.find(r => r.classification_name === classification_name);
          list += "<li>";
          list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            classification_name +
            ' vehicles">' +
            classification_name +
            "</a>";
          list += "</li>";
        }
      });
    }
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("getNav error:", error.message);
    // Enhanced fallback navigation with minimal required links
    return "<ul><li><a href='/' title='Home page'>Home</a></li><li><a href='/inv/new-cars' title='View new cars'>Custom</a></li></ul>";
  }
};

/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the inventory detail view HTML
 ************************************** */
Util.buildInventoryDetail = async function (data) {
  let detail = `
    <div class="detail-container">
      <div class="detail-image">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" />
      </div>
      <div class="detail-content">
        <h2>${data.inv_make} ${data.inv_model}</h2>
        <p><strong>Year:</strong> ${data.inv_year}</p>
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(
          data.inv_price
        )}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(
          data.inv_miles || 0
        )} miles</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
      </div>
    </div>
  `;
  return detail;
};

/* ************************
 * Middleware to handle errors in async route handlers
 ************************ */
Util.handleErrors = function (fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(`Error in ${fn.name || 'route handler'} at ${req.url}:`, error.message);
      error.status = error.status || 500;
      next(error);
    }
  };
};

/* ************************
 * Build classification list for dropdown
 * ************************ */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    const data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    if (data.rows && data.rows.length > 0) {
      // Use a Set to avoid duplicates in the dropdown as well
      const uniqueClassifications = [...new Set(data.rows.map(row => row.classification_name))];
      uniqueClassifications.forEach((classification_name) => {
        const row = data.rows.find(r => r.classification_name === classification_name);
        classificationList += `<option value="${row.classification_id}"`;
        if (classification_id != null && row.classification_id == classification_id) {
          classificationList += " selected ";
        }
        classificationList += `>${classification_name}</option>`;
      });
    }
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("buildClassificationList error:", error.message);
    return '<select name="classification_id" id="classificationList" required><option value="">Choose a Classification</option></select>';
  }
};

/* ************************
 * Wrapper for model functions to maintain consistency
 ************************ */
Util.getInventoryByClassificationId = async function (classification_id) {
  return await invModel.getInventoryByClassificationId(classification_id);
};

Util.getInventoryByInvId = async function (inv_id) {
  return await invModel.getInventoryByInvId(inv_id);
};

module.exports = Util;