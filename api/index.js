// This file is required for Vercel to recognize the serverless function
// but we'll handle routing in server.js
export default (req, res) => {
  res.status(404).send("Not found");
};
