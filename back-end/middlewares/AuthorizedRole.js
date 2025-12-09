

//testing jira

export default function AuthorizedRole() {

  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
