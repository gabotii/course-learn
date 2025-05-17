const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * Render-hosted databases require SSL/TLS
 * Simplify configuration to always use SSL
 * *************** */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? false // Disable SSL for local development if using localhost
    : { rejectUnauthorized: false }, // Enable SSL for Render with self-signed certs
});

// Added for troubleshooting queries
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
};
