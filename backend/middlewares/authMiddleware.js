import jwt from "jsonwebtoken";
import { error } from "../utils/error.js";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json(error("UNAUTHORIZED", null, "No token provided"));

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json(error("INVALID_TOKEN", null, "Token invalid or expired"));
    req.user = decoded;
    next();
  });
}
