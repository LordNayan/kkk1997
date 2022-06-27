const { check,param } = require('express-validator');
const {allowedCommentTypes} = require("../config/config")
module.exports = {
    addCommentValidator: check('comment').exists().isLength({ min: 1 }).trim().escape().withMessage('comment must have more than 1 character'),
    addReplyValidator: [
        check('comment').exists().isLength({ min: 1 }).trim().escape().withMessage('comment must have more than 1 character'),
        param('id').exists().isLength({ min: 36 }).trim().escape().withMessage('invalid parent comment id'),
    ],
    editCommentValidator: [
        check('comment').exists().isLength({ min: 1 }).trim().escape().withMessage('comment must have more than 1 character'),
        check('type').exists().isIn(allowedCommentTypes).trim().escape().withMessage('comment type missing'),
        param('id').exists().isLength({ min: 36 }).trim().escape().withMessage('invalid comment id'),
    ],
    deleteCommentValidator: [
        check('type').exists().isIn(allowedCommentTypes).trim().escape().withMessage('comment type missing'),
        param('id').exists().isLength({ min: 36 }).trim().escape().withMessage('invalid comment id'),
    ]

}