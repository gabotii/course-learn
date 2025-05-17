/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const baseController = require("./controllers/base-controller");
const pool = require("./database");
const utilities = require("./utilities");
const inventoryRoute = require("./routes/inventory-route");

const app = express();

/* **************************
 * View Engine and Templates
 **************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not required in express-ejs-layouts v6+

/* **************************
 * Routes
 **************************/
app.use(require("./routes/static"));
// Index route - Unit 3, activity
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use("/inv", inventoryRoute);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000; // Fallback port
const host = process.env.HOST || "localhost"; // Fallback host

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});