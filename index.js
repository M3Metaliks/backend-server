require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const pool = require("./db");

const app = express();

app.use(cors({ origin: "*" }));

app.post("/submit", upload.none(), async (req, res) => {
  try {
    const {
      primary_industry,
      full_name,
      email,
      mobile,
      country,
      linkedin,
      accredited_investor,
      investment_size,
      experience,
      check_size,
      asset_classes,
      preferred_industries,
      geo_focus,
      risk_appetite,
      expected_return,
      investment_horizon,
      terms,
    } = req.body;

    const toArray = (val) =>
      Array.isArray(val) ? val : typeof val === "string" ? [val] : [];

    await pool.query(
      `INSERT INTO investor_form (
        primary_industry, full_name, email, mobile, country, linkedin,
        accredited_investor, investment_size, experience, check_size,
        asset_classes, preferred_industries, geo_focus,
        risk_appetite, expected_return, investment_horizon, terms
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16, $17
      )`,
      [
        primary_industry,
        full_name,
        email,
        mobile || null,
        country,
        linkedin,
        accredited_investor,
        investment_size,
        experience || null,
        check_size || null,
        toArray(asset_classes),
        toArray(preferred_industries),
        toArray(geo_focus),
        risk_appetite,
        expected_return,
        investment_horizon,
        terms === "on",
      ]
    );

    res.status(200).json({ success: true, message: "Data inserted!" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
