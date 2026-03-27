import express from "express";
import axios from "axios";

const app = express();

// IMPORTANT for Vercel
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static("public"));

// Set EJS
app.set("view engine", "ejs");
app.set("views", "./views");

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
        "x-access-token": process.env.API_KEY,
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
    console.log("ERROR:", error.message);
    res.status(500).send("Error: " + error.message);
  }
});

// ❗ IMPORTANT FOR VERCEL
export default app;