import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;

// Home route
app.get("/", (req, res) => {
  res.render("index", { data: null, error: null });
});

// Form route
app.post("/check", async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const response = await axios.get("https://api.openuv.io/api/v1/uv", {
      params: { lat, lng },
      headers: {
        "x-access-token": API_KEY,
      },
    });

    const result = response.data.result;

    const uv = result.uv;
    const ozone = result.ozone;

    let advice = "";
    let color = "";
    let category = "";

    if (uv < 3) {
      category = "Low";
      advice = "No protection needed 😎";
      color = "#4CAF50";
    } else if (uv < 6) {
      category = "Moderate";
      advice = "Use sunscreen 🧴";
      color = "#FFC107";
    } else if (uv < 8) {
      category = "High";
      advice = "Wear SPF 30+ & sunglasses 🕶️";
      color = "#FF5722";
    } else if (uv < 11) {
      category = "Very High";
      advice = "Avoid sun & use SPF 50+ ☀️";
      color = "#F44336";
    } else {
      category = "Extreme";
      advice = "Stay indoors 🚫☀️";
      color = "#9C27B0";
    }

    const time = new Date().toLocaleString();

    res.render("index", {
      data: { uv, ozone, advice, color, category, time },
      error: null,
    });

  } catch (error) {
    console.log(error.message);
    res.render("index", {
      data: null,
      error: "❌ Failed to fetch UV data. Check API or inputs.",
    });
  }
});

// Start server
export default app;