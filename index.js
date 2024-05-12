import axios from "axios";
import express from "express";
import { Redisclient } from "./client.js";

const app = express();

app.get("/api", async (req, res) => {
  try {
    // Check if data is cached in Redis
    const cachedValue = await Redisclient.get("countries");
    if (cachedValue) {
      console.log("Data retrieved from cache");
      return res
        .json({ data: JSON.parse(cachedValue), status: true })
        .status(200);
    }

    // Fetch data from API if not cached
    const { data } = await axios.get(
      "https://api.nationalize.io/?name=nathaniel"
    );

    await Redisclient.set("countries", JSON.stringify(data));

    return res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", async (req, res) => {
  await Redisclient.del("countries");
  res.send("Hello World!");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
