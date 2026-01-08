const express = require("express");
const Product = require("../models/Products");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
router.get("/products", verifyToken, async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.get("/products/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(400).json(error);
  }
});

/* CREATE PRODUCT */
router.post("/", verifyToken, async (req, res) => {
  const { name, price } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });
  if (!price || price <= 0)
    return res.status(400).json({ message: "Price must be positive" });

  const product = await Product.create(req.body);
  res.status(201).json(product);
});

/* UPDATE PRODUCT */
router.patch("/products/:id", verifyToken, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid ID" });

  if (req.body.price && req.body.price <= 0)
    return res.status(400).json({ message: "Price must be positive" });

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!product) return res.status(404).json({ message: "Not found" });

  res.json(product);
});

/* DELETE PRODUCT */
router.delete("/products/:id", verifyToken, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid ID" });

  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) return res.status(404).json({ message: "Not found" });

  res.json({ message: "Deleted", product });
});
module.exports = router;
