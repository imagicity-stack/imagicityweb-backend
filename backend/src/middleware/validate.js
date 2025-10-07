export default function validateBody(
  schema,
  { allowUnknown = false, onError } = {}
) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown,
      stripUnknown: true,
    });

    if (error) {
      error.status = 400;
      error.details = error.details?.map((detail) => detail.message);
      if (typeof onError === 'function') {
        Promise.resolve(onError(req))
          .catch(() => {})
          .finally(() => next(error));
        return;
      }
      next(error);
      return;
    }

    req.body = value;
    next();
  };
}
