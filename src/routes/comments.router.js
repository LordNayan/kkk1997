const express = require('express');
const router = express.Router();
const commentsController = require("../controllers/comments.controller")

router.get("/",commentsController.getComments)

module.exports = router;