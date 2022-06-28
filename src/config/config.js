module.exports = {
    PORT: 8080,
    db: {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "",
        DB: "ghost"
    },
    TRACE: false,
    custom: {
        log: (message, ...arrayOfMessages) => {
            if (module.exports.TRACE) {
                console.log(message, ...arrayOfMessages);
            }
        }
    },
    allowedCommentTypes: ["parent", "child"],
    getCommentsQuery: `select
    c.id as CommentId,
    cc.id as ReplyId,
    c.content as CommentContent,
    c.created_at as CommentCreatedAt,
    cc.content as ReplyContent,
    c.author as CommentAuthor,
    c.author_image as CommentAuthorImage,
    cc.author as ReplyAuthor,
    cc.author_image as ReplyAuthorImage,
    cc.created_at as ReplyCreatedAt,
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
    c.id = cc.parent_id 
order by c.created_at desc`
};