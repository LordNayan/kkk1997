function addComment() {
  let comment = document.forms["CommentForm"]["add_comment"].value;
  let addCommentUrl = "http://localhost:8080/comments/add";
  axios({
    method: "post",
    url: addCommentUrl,
    data: {
      comment: comment,
    },
  })
    .then(async (data) => {
      console.log(data);
      let comments = await getComments();
      paintCommentsUI(comments);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getComments() {
  return new Promise((res,rej) => {
    let getCommentsUrl = "http://localhost:8080/comments/";
    axios({
      method: "get",
      url: getCommentsUrl,
    })
      .then((data) => {
        console.log(data);
        return res(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function addReply(parentCommentId) {
  let comment = document.forms[`ReplyForm_${parentCommentId}`]["add_reply"].value;
  let addReplyUrl = `http://localhost:8080/comments/addReply/${parentCommentId}`;
  axios({
    method: "post",
    url: addReplyUrl,
    data:{
        comment:comment
    }
  })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function upvote(commentId, type = 'parent') {
    console.log(this)
  let upvoteUrl = `http://localhost:8080/comments/upvote/${commentId}`;
  axios({
    method: "post",
    url: upvoteUrl,
    data:{
        type:type
    }
  })
    .then(async(data) => {
      console.log(data);
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
    let returnString = `<img src="${comment.authorImage}" alt="Avatar">${comment.author}<br>
    <textarea id="${comment.id}" rows="4" cols="50">
   ${comment.content}
    </textarea>
    <br>
        <button class="upvote up" onclick=upvote("${comment.id}")><i class="fa fa-caret-up"></i>${comment.upvotes} upvote</button>
        <button class="upvote up" onclick=showReplyModal("ReplyForm_${comment.id}")><i class="fa fa-mail-reply"></i> reply</button>
       <br>
       <form hidden id="ReplyForm_${comment.id}" autocomplete="off" onsubmit=addReply("${comment.id}");return false">
       <input id="add_reply" class="comment r2" placeholder="Type in your reply" type="text" value=""> 
       <input type="submit" id="replyButton" value="Reply"/>
   </form>
   <div id="replies-container" class="row">`
   for(let reply of comment.replies){
    returnString+=`<img src="${reply.authorImage}" alt="Avatar">${reply.author}<br>
    <textarea id="${reply.id}" rows="4" cols="50">
   ${reply.content}
    </textarea>
    <button class="upvote up" onclick=upvote("${reply.id}","child")><i class="fa fa-caret-up"></i>${reply.upvotes} upvote</button>`
   }
   returnString+= `</div>`;
   return returnString;
}

$( document ).ready(async function() {
    let comments = await getComments();
    paintCommentsUI(comments);
});

function showReplyModal(divId) {
    if(document.getElementById(divId).style.display == "block"){
        $(`#${divId}`).hide()
    }
    else{
        $(`#${divId}`).show()
    }
 }