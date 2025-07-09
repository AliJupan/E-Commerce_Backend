import jwt from "jsonwebtoken";

class AuthenticationMiddleware {
  authenticate() {
    return [
      async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          return res
            .status(401)
            .json({ success: false, error: "Token required" });
        }

        const [Bearer, token] = authHeader.split(" ");

        if (Bearer !== "Bearer") {
          return res
            .status(401)
            .json({ success: false, error: "Invalid token" });
        }

        try {
          req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
          next();
        } catch (error) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid token" });
        }
      },
    ];
  }

  authenticateSocket(token) {
    if (!token) {
      return false;
    }

    const [Bearer, actualToken] = token.split(" ");

    if (Bearer !== "Bearer") {
      return false;
    }

    try {
      const user = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthenticationMiddleware();
