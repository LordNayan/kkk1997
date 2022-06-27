const express = require('express');
const router = express.Router();
const commentsController = require("../controllers/comments.controller")
const validator = require("../validators/comments.validator")

router.get("/", commentsController.getComments)
router.post("/add", validator.addCommentValidator, commentsController.addComment)
router.post("/addReply/:id", validator.addReplyValidator, commentsController.addReply)
router.put("/:id", validator.editCommentValidator, commentsController.editComment)
router.delete("/:id", validator.deleteCommentValidator, commentsController.deleteComment)
router.post("/upvote/:id", validator.deleteCommentValidator, commentsController.upvoteComment)

module.exports = router;