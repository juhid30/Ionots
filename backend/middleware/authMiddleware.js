const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from cookies
  console.log("Cookies:", req.cookies);

  const token = req.cookies.token;
  console.log("TOKEN!!!", req.cookies.token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to req.user
    req.user = decoded.user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
