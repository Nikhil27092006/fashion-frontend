import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/orders", (req, res) => {
    const orders = JSON.stringify(req.body, null, 4);
    fs.writeFileSync("orders.json", orders);
    res.json({ message: "Order saved" });
});

app.listen(4000, () => console.log("Mock API running on port 4000"));
