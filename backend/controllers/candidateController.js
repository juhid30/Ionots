const Candidate = require("../models/userModel");

// Get candidate details by ID
exports.getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    res.status(200).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
