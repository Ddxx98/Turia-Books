import jwt from "jsonwebtoken";

export function signJwt(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined in environment");
  return jwt.sign(payload, secret, { expiresIn: "1h", ...options });
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined in environment");
  return jwt.verify(token, secret);
}