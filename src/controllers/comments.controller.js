const dbAction = require("../models/sqlModel");
const db = new dbAction();
const { validationResult, body } = require('express-validator');
const { generateName, getImage } = require("../util/randomPersonGenerator")
const moment = require("moment")
const uuid = require('uuid')
module.exports = {
    getComments: async function (req, res) {
        const result = await db.customSql(`select
        c.id as CommentId,
        cc.id as ReplyId,
        c.content as CommentContent,
        cc.content as ReplyContent,
        c.author as CommentAuthor,
        c.author_image as CommentAuthorImage,
        cc.author as ReplyAuthor,
        cc.author_image as ReplyAuthorImage,
        (
        SELECT
            COUNT(u.comment_id)
        FROM
            ghost.upvotes u
        WHERE
            u.comment_id = c.id) as 'parentUpvotes',
                (
        SELECT
            COUNT(u.child_comment_id)
        FROM
            ghost.upvotes u
        WHERE
            u.child_comment_id  = cc.id) as 'childUpvotes'
    from
        ghost.comments c
    left join ghost.child_comments cc 
    on
        c.id = cc.parent_id `);
        let commentReplyMap = new Map();
        let comments = [];
        for (let res of result) {
            let commentObj = commentReplyMap.get(res.CommentId);
            if (!commentObj) {
                commentObj = {
                    id: res.CommentId,
                    content: res.CommentContent,
                    upvotes: res.parentUpvotes,
                    author: res.CommentAuthor,
                    authorImage: res.CommentAuthorImage,
                    replies: []
                };
     
            }
            if(res.ReplyId){
                let replyObj = {
                    id: res.ReplyId,
                    content: res.ReplyContent,
                    upvotes: res.childUpvotes,
                    author: res.ReplyAuthor,
                    authorImage: res.ReplyAuthorImage
                };
                commentObj.replies.push(replyObj);
            }
            commentReplyMap.set(res.CommentId, commentObj)
        }
        for ([key, value] of commentReplyMap.entries()) {
            comments.push(value)

        }
        res.send(comments)
    },
    addComment: async function (req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            const body = req.body;
            const comment = body.comment;

            await db.insertRecords("comments", 'id,content,created_at,updated_at,author,author_image', '?,?,?,?,?,?',
                [uuid.v4(), comment, moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss'), generateName(), getImage()]);
            return res.send({ success: true, msg: "Comment inserted successfully." })
        }

        catch (error) {
            return res.status(400).send({ success: false, error: error });
        }
    },
    addReply: async function (req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            const body = req.body;
            const comment = body.comment;
            const parentCommentId = req.params.id;

            await db.insertRecords("child_comments", 'id,parent_id,content,created_at,updated_at,author,author_image', '?,?,?,?,?,?,?',
                [uuid.v4(), parentCommentId, comment, moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss'), generateName(), getImage()]);
            return res.send({ success: true, msg: "Reply inserted successfully." })
        }

        catch (error) {
            return res.status(400).send({ success: false, error: error });
        }
    },
    editComment: async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            const type = req.body.type;
            const comment = req.body.comment;
            const tableName = type == "parent" ? "comments" : "child_comments";
            await db.updateRecords(tableName, 'content=?,updated_at=?', `id = "${req.params.id}"`, [comment, moment().format('YYYY-MM-DD HH:mm:ss')]);

            res.send({ success: true, msg: "Comment updated successfully." })
        }
        catch (error) {
            return res.status(400).send({ success: false, error: error });
        }
    },
    deleteComment: async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            const type = req.body.type;
            const tableName = type == "parent" ? "comments" : "child_comments";
            if (tableName == "comments") {
                await db.deleteRecord("child_comments", `parent_id = "${req.params.id}"`);
            }
            await db.deleteRecord(tableName, `id = "${req.params.id}"`);

            res.send({ success: true, msg: "Comment deleted successfully." })
        }
        catch (error) {
            return res.status(400).send({ success: false, error: error });
        }
    },
    upvoteComment: async function (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            const type = req.body.type;
            const id = req.params.id;
            const columnName = type == "parent" ? "comment_id" : "child_comment_id";
            await db.insertRecords("upvotes", `${columnName},created_at`, '?,?',
                [id, moment().format('YYYY-MM-DD HH:mm:ss')]);
            res.send({ success: true, msg: "Comment upvoted successfully." })
        }
        catch (error) {
            return res.status(400).send({ success: false, error: error });
        }
    }
}