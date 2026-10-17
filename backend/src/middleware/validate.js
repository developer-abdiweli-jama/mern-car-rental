const validators = {
  required: (v) => v !== undefined && v !== null && v !== '',
  email: (v) => /^\S+@\S+\.\S+$/.test(String(v)),
  objectId: (v) => /^[0-9a-fA-F]{24}$/.test(String(v)),
  dateISO: (v) => !Number.isNaN(Date.parse(v)),
  minLength: (n) => (v) => String(v).length >= n,
  maxLength: (n) => (v) => String(v).length <= n,
  min: (n) => (v) => Number(v) >= n,
  max: (n) => (v) => Number(v) <= n,
  in: (allowed) => (v) => allowed.includes(v),
  positiveInteger: (v) => Number.isInteger(Number(v)) && Number(v) > 0,
};

const rule = (fn, message) => {
  const r = (v) => (fn(v) ? true : message);
  return r;
};

export const validate = (schema) => (req, res, next) => {
  const errors = {};

  for (const [field, spec] of Object.entries(schema)) {
    const source = spec.source || 'body';
    const value = source === 'params' ? req.params[field] : source === 'query' ? req.query[field] : req.body[field];

    if (spec.optional && (value === undefined || value === '')) continue;

    if (spec.required && (value === undefined || value === null || value === '')) {
      errors[field] = spec.message || `${field} is required`;
      continue;
    }

    if (value === undefined || value === '') continue;

    for (const r of spec.rules || []) {
      const result = r(value);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, error: 'Validation failed', fields: errors });
  }
  next();
};

export { validators, rule };
