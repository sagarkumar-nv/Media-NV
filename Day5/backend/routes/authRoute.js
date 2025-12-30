import express from "express";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post("/login", (req, res) => {
  const { username } = req.body;

  const token = jwt.sign(
    { username },
    "SECRET_KEY",
    { expiresIn: "1h" }
  );
  console.log(username)
  res.json({ token });
});

export default router;
