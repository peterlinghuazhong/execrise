const express = require("express");
const Product = require("../models/Products");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

module.exports = router;
