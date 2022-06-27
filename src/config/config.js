module.exports = {
    PORT:8080,
    db:{
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
    allowedCommentTypes:["parent","child"],
  };