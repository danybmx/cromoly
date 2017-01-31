module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new HttpError(403, 'Forbidden'));
  }
  next();
};
