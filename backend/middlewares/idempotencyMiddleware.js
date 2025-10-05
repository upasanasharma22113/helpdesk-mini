
const usedKeys = new Set();
export const checkIdempotency = (req, res, next) => {
  const key = req.headers["idempotency-key"];
  if (!key) return res.status(400).json({ error: { code: "FIELD_REQUIRED", field: "Idempotency-Key" } });
  if (usedKeys.has(key))
    return res.status(409).json({ error: { code: "IDEMPOTENT_REPLAY", message: "Duplicate request" } });
  usedKeys.add(key);
  next();
};
