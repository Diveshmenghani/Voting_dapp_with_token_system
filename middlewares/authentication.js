const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication Failed" });
    }

    const decoded = jwt.verify(token, "secretKey");
    if (!decoded.accountAddress) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.accountAddress = decoded.accountAddress;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed", error });
  }
};

module.exports = { authentication };
