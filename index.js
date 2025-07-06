const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/submit", async (req, res) => {
  const { full_name, email, mobile, country } = req.body;

  try {
    await pool.query(
      "INSERT INTO investor_form (full_name, email, mobile, country) VALUES ($1, $2, $3, $4)",
      [full_name, email, mobile, country]
    );

    res.json({ success: true, message: "Data inserted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
