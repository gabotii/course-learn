const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const session = require("express-session");
const pool = require("./database/");
const baseController = require("./controllers/base-controller");
const utilities = require("./utilities");
const inventoryRoute = require("./routes/inventory-route");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const flash = require("connect-flash");

const inventoryController = require("./controllers/inventory-controller");

const app = express();

/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  res.locals.getMessages = function () {
    return req.flash("notice");
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

/* **************************
 * View Engine and Templates
 **************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* **************************
 * Middleware for CSP
 **************************/
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self';"
  );
  next();
});

/* **************************
 * Routes
 **************************/
app.use(require("./routes/static"));
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

app.get("/inv/", utilities.handleErrors(inventoryController.getManagementView));

app.get("/inv/add-classification", utilities.handleErrors(inventoryController.getAddClassificationView));
app.post(
  "/inv/add-classification",
  [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z0-9]+$/).withMessage("Classification name cannot contain spaces or special characters")
      .notEmpty().withMessage("Classification name is required"),
  ],
  utilities.handleErrors(inventoryController.addClassification)
);

app.get("/inv/add-inventory", utilities.handleErrors(inventoryController.getAddInventoryView));
app.post(
  "/inv/add-inventory",
  [
    body("classification_id").isInt().withMessage("Please select a classification"),
    body("inv_make").notEmpty().withMessage("Make is required"),
    body("inv_model").notEmpty().withMessage("Model is required"),
    body("inv_year").isInt({ min: 1900, max: 2026 }).withMessage("Invalid year"),
    body("inv_description").notEmpty().withMessage("Description is required"),
    body("inv_image").notEmpty().withMessage("Image path is required"),
    body("inv_thumbnail").notEmpty().withMessage("Thumbnail path is required"),
    body("inv_price").isFloat({ min: 0 }).withMessage("Invalid price"),
    body("inv_miles").isInt({ min: 0 }).withMessage("Invalid miles"),
    body("inv_color").notEmpty().withMessage("Color is required"),
  ],
  utilities.handleErrors(inventoryController.addInventory)
);

app.get("/inv/new-cars", utilities.handleErrors(inventoryController.getNewCarsView));

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "0.0.0.0";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`);
});

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at ${req.url}:`, err.stack);
  let nav;
  try {
    nav = await utilities.getNav();
  } catch (navError) {
    console.error("Error fetching nav in error handler:", navError.message);
    nav = "<ul><li><a href='/' title='Home page'>Home</a></li></ul>";
  }

  const status = err.status || 500;
  const message = status === 500 
    ? "An unexpected server error occurred. Please try again later."
    : err.message || "Something went wrong.";

  res.status(status).render("errors/error", {
    title: status === 500 ? "Server Error" : "Error",
    message,
    nav,
  }, (err, html) => {
    if (err) {
      console.error("Error rendering error view:", err);
      res.status(500).send("Internal Server Error: Rendering failed");
    } else {
      res.send(html);
    }
  });
});  