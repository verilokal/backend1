const businessOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'business') {
    return res.status(403).json({ message: 'Only businesses can access this route' });
  }
  next();
};

export default businessOnly;
