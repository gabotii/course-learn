const utilities = require("../utilities");
const accountModel = require("../models/account-model");

/* ****************************************
 * Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    error.status = 500;
    error.message = "Failed to load login page.";
    next(error);
  }
}

/* ****************************************
 * Process login (placeholder)
 * *************************************** */
async function processLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    req.flash("notice", "Login processing not implemented yet.");
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    error.status = 500;
    error.message = "Failed to process login.";
    next(error);
  }
}

/* ****************************************
 * Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    error.status = 500;
    error.message = "Failed to load registration page.";
    next(error);
  }
}

/* ****************************************
 * Process registration
 * *************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    } else {
      throw new Error("Registration failed: No rows returned from database.");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("notice", "An error occurred during registration. Please try again.");
    error.status = error.status || 500;
    res.status(error.status).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }
}

module.exports = { buildLogin, processLogin, buildRegister, registerAccount };