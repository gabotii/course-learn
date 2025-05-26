const pool = require("../database/");

const inventoryModel = {};

/* ***************************
 * Add new classification
 * ************************** */
inventoryModel.addClassification = async function (classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("addClassification error:", error.message);
    return false;
  }
};

/* ***************************
 * Get all classifications
 * ************************** */
inventoryModel.getClassifications = async function () {
  try {
    const sql = "SELECT DISTINCT ON (classification_name) * FROM classification ORDER BY classification_name, classification_id";
    const result = await pool.query(sql);
    return result || { rows: [] }; // Ensure consistent return structure
  } catch (error) {
    console.error("getClassifications error:", error.message);
    return { rows: [] }; // Return empty rows on failure
  }
};

/* ***************************
 * Add new inventory item
 * ************************** */
inventoryModel.addInventory = async function ({
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
}) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const result = await pool.query(sql, [
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
    ]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("addInventory error:", error.message);
    return false;
  }
};

/* ***************************
 * Get inventory by classification ID with classification name
 * ************************** */
inventoryModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name 
      FROM inventory i 
      JOIN classification c ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error.message);
    return [];
  }
};

/* ***************************
 * Get inventory by inventory ID (existing)
 * ************************** */
inventoryModel.getInventoryByInvId = async function (inv_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name 
      FROM inventory i 
      JOIN classification c ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getInventoryByInvId error:", error.message);
    return null;
  }
};

module.exports = inventoryModel;