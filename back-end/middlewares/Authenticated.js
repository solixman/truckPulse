export default async function isAuthenticated() {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization && authorization.split(" ")[1];
    const refreshToken = req.cookies?.jwt;

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError" && refreshToken) {
          try {
            const user = jwt.verify(
              refreshToken,
              process.env.REFRESH_TOKEN_SECRET
            );
            const newAccessToken = jwt.sign(
              { username: user.username, email: user.email },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1m" }
            );

            res.setHeader("x-access-token", newAccessToken);
            req.user = user;
            return next();
          } catch {
            return res.status(403).json({ message: "Invalid refresh token" });
          }
        } else {
          return res.status(403).json({ message: "Invalid token" });
        }
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
}
