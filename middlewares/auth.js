import jwt from "jsonwebtoken";

export const requireSignIn = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.json({
      err,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.role.includes("Admin")) {
      return res.status(403).json({
        err: "Admin resource. Access denied.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      err,
    });
  }
};
