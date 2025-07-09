import jwt from "jsonwebtoken";

class UserMiddleware {
  authorize() {
    return [
      async (req, res, next) => {
        const userId = req.params.id;

        if (!req.user) {
          return res.status(401).json({ error: "Token is missing or invalid" });
        }

        // Allow if the user is accessing their own data or if the user is an ADMIN
        if (req.user.id == userId) {
          next();
        } else {
          return res.status(403).json({ error: "Unauthorized access" });
        }
      },
    ];
  }

  verifyEmailMatchFromToken() {
    return [
      async (req, res, next) => {
        try {
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
              .status(401)
              .json({ error: "Authorization header missing or invalid" });
          }

          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

          const bodyEmail = req.body.email;
          if (!bodyEmail) {
            return res
              .status(400)
              .json({ error: "Email is required in the request body" });
          }

          if (decoded.email !== bodyEmail) {
            return res
              .status(403)
              .json({ error: "Email does not match token" });
          }

          next();
        } catch (error) {
          return res.status(401).json({ error: "Invalid token" });
        }
      },
    ];
  }

  authorizeSocket(userId, token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Allow access if the user is the same or is an ADMIN
      return user.id == userId || user.role === "SUPER_ADMIN";
    } catch (error) {
      return false;
    }
  }
}

export default new UserMiddleware();
