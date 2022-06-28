const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config/config");
const indexRouter = require("./routes/index.router");
const commentRouter = require("./routes/comments.router");
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", indexRouter);
app.use("/comments", commentRouter);

// set port, listen for requests
const PORT = process.env.PORT || config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
