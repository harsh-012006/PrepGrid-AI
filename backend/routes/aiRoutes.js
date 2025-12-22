const express = require("express");
const { generateInterviewQuestions , generateExplaination} = require("../controllers/aiController");
const {protect} = require("../middlewares/authMiddleware");

const router = express.Router();



router.post("/generate-questions", generateInterviewQuestions);
router.post("/generate-explanation", generateExplaination);

module.exports = router;
