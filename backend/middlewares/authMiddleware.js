const jwt = require("jsonwebtoken");
const User = require("../models/User");

//middleware to protect router
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not Authorized, No Token" });
    }
    
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized to access this route", error: err.message });
  }
};

module.exports = { protect }; 
