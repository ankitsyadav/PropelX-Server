// user-agent-check.js
module.exports = (req, res, next) => {
  const userAgent = req.header("User-Agent");
  const blockedUserAgents = [
    "PostmanRuntime",
    "Thunder Client (https://www.thunderclient.io)",
  ];

  if (blockedUserAgents.some((agent) => userAgent.includes(agent))) {
    return res
      .status(403)
      .json({ message: "Forbidden: API access is restricted" });
  }
  next();
};
