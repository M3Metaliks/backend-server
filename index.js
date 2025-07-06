const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const pool = require("./db");

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/submit",
  upload.fields([
    { name: "kyc_document", maxCount: 1 },
    { name: "pof_document", maxCount: 1 },
    { name: "tax_document", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { full_name, email, mobile, country } = req.body;

      // Check if required fields are present
      if (!full_name || !email || !country) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      await pool.query(
        "INSERT INTO investor_form (full_name, email, mobile, country) VALUES ($1, $2, $3, $4)",
        [full_name, email, mobile || null, country]
      );

      console.log("Form data:", req.body);
      console.log("Files uploaded:", req.files);

      res.status(200).json({ success: true, message: "Data inserted!" });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  }
);

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
