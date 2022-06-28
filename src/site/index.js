function addComment() {
  let comment = document.getElementById("commentInputBox").value;
  let addCommentUrl = "http://localhost:8080/comments/add";
  axios({
    method: "post",
    url: addCommentUrl,
    data: {
      comment: comment,
    },
  })
    .then(async (data) => {
      let comments = await getComments();
      paintCommentsUI(comments);
      document.getElementById("commentInputBox").value = "";
    })
    .catch((err) => {
      console.log(err);
    });
}

function getComments() {
  return new Promise((res, rej) => {
    let getCommentsUrl = "http://localhost:8080/comments/";
    axios({
      method: "get",
      url: getCommentsUrl,
    })
      .then((data) => {
        return res(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function addReply(parentCommentId) {
  let comment = document.getElementById(
    `replyInputBox_${parentCommentId}`
  ).value;
  let addReplyUrl = `http://localhost:8080/comments/addReply/${parentCommentId}`;
  axios({
    method: "post",
    url: addReplyUrl,
    data: {
      comment: comment,
    },
  })
    .then(async (data) => {
      let comments = await getComments();
      paintCommentsUI(comments);
    })
    .catch((err) => {
      console.log(err);
    });
}

function upvote(commentId, type = "parent") {
  let upvoteUrl = `http://localhost:8080/comments/upvote/${commentId}`;
  axios({
    method: "post",
    url: upvoteUrl,
    data: {
      type: type,
    },
  })
    .then(async (data) => {
      let comments = await getComments();
      paintCommentsUI(comments);
    })
    .catch((err) => {
      console.log(err);
    });
}

function paintCommentsUI(comments) {
  try {
    $("#comments-container").html("");
    for (let comment of comments) {
      $("#comments-container").append(getOneCommentCard(comment));
    }
  } catch (error) {
    console.log(error);
  }
}

function getOneCommentCard(comment) {
  let current = Date.now();
  let timeDiff = timeDifference(current, new Date(comment.createdAt));
  let returnString = `<div class="media">
  <img
    class="mr-3 rounded-circle"
    alt="Bootstrap Media Preview"
    src="${comment.authorImage}"
  />
  <div class="media-body">
    <div class="row">
      <div class="col-8 d-flex">
        <h5><b>${comment.author}</b></h5>
        <span>- ${timeDiff}</span>
      </div>

      <div class="col-4">
        <div class="pull-right reply">
          <a onclick=upvote("${comment.id}") href="javascript: void(0)"
            ><span
              ><i class="fa fa-caret-up"></i>${comment.upvotes} upvote</span
            ></a
          >
        </div>

        <div class="pull-right reply mr-4">
          <a onclick=showReplyModal("ReplyForm_${comment.id}") href="javascript: void(0)"
            ><span><i class="fa fa-reply"></i> reply</span></a
          >
        </div>
      </div>
    </div>
    ${comment.content}
    <div hidden class="media mt-4" id="ReplyForm_${comment.id}">
      <img
        class="mr-3 rounded-circle"
        alt="Bootstrap Media Preview"
        src="./images/6.jpg"
      />
      <div class="media-body">
        <div class="row"></div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Put your reply here..."
            id="replyInputBox_${comment.id}"
          />
        </div>
      </div>
      <button type="button" class="btn btn-secondary" onclick=addReply("${comment.id}")>
        Reply
      </button>
    </div>`;
  for (let reply of comment.replies) {
    let timeDiff = timeDifference(current, new Date(reply.createdAt));
    returnString += `<br><div class="media mt-4">
    <a class="pr-3" href="javascript: void(0)"
      ><img
        class="rounded-circle"
        alt="Bootstrap Media Another Preview"
        src="${reply.authorImage}"
    /></a>
    <div class="media-body">
      <div class="row">
        <div class="col-8 d-flex">
          <h5><b>${reply.author}</b></h5>
          <span>- ${timeDiff}</span>
        </div>
        <div class="col-4">
          <div class="pull-right reply">
            <a href="javascript: void(0)" onclick=upvote("${reply.id}","child")
              ><span><i class="fa fa-caret-up"></i>${reply.upvotes} upvote</span></a
            >
          </div>
        </div>
      </div>
      ${reply.content}
    </div>
  </div>`;
  }

  returnString += `<br></div>`;
  return returnString;
}

$(document).ready(async function () {
  let comments = await getComments();
  paintCommentsUI(comments);
});

function showReplyModal(divId) {
  if ($(`#${divId}`).attr("hidden")) {
    $(`#${divId}`).removeAttr("hidden");
  } else {
    $(`#${divId}`).attr("hidden", true);
  }
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "approximately " + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "approximately " + Math.round(elapsed / msPerYear) + " years ago";
  }
}