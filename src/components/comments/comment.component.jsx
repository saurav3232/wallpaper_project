import React from "react";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import {
  addCommentsToDb,
  getCommentsArray,
} from "../../utils/Firebase/Firebase.utils";
import { db } from "../../utils/Firebase/Firebase.utils";
import { doc, onSnapshot } from "firebase/firestore";
import { v4 } from "uuid";
import { getUserData } from "../../utils/Firebase/Firebase.utils";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import "./comment.styles.css";
import { deleteCommentsFromDb } from "../../utils/Firebase/Firebase.utils";
const Comment = (props) => {
  const imageId = props.imageId;
  const imageCategory = props.imageCategory;
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [commentsArray, setCommentsArray] = useState([]);
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    const fetchComments = async () => {
      const commentsArray = await getCommentsArray(imageCategory, imageId);
      onSnapshot(doc(db, "images", imageCategory), (doc) => {
        doc.data().arr.forEach((obj) => {
          if (obj.imageId === imageId) {
            setCommentsArray(obj.comments);
          }
        });
      });
      setCommentsArray(commentsArray);
      setLoading(false);
    };
    fetchComments();
    // eslint-disable-next-line
  }, []);
  const addToCommentsHandler = async () => {
    const getDate = new Date();
    const day = getDate.getDay();
    const month = getDate.getMonth();
    const year = getDate.getFullYear();
    const currentUserInfo = await getUserData(currentUser.uid);
    const commentObj = {
      createdAt: `${day}/${month}/${year}`,
      createdBy: currentUserInfo.displayName,
      comment: comment,
      createrId: currentUser.uid,
      commentId: v4(),
    };
    await addCommentsToDb(imageCategory, imageId, commentObj);
    setComment("");
  };
  const deleteCommentsHandler = async (commentId) => {
    await deleteCommentsFromDb(imageCategory, commentId);
  };
  return (
    <div>
      <h1>Comments</h1>
      {!loading ? (
        <div className="commentContainer">
          <div className="input-group mb-3">
            <textarea
              type="text"
              className="form-control"
              placeholder="Add Comments"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            className="btn btn-info"
            onClick={addToCommentsHandler}
          >
            Add Comment
          </button>
          <div className="commentsArray">
            {commentsArray.map((comment, idx) => (
              <div className="comment" key={idx}>
                <div className="comment-parts">
                  {comment.createdBy} commented:
                </div>
                <div className="comment-parts">{comment.comment}</div>
                <div className="comment-parts">on "{comment.createdAt}"</div>
                {currentUser.uid === comment.createrId ? (
                  <div className="comment-parts">
                    <button type="button" className="btn btn-danger">
                      <i
                        className="bi bi-trash"
                        onClick={() => deleteCommentsHandler(comment.commentId)}
                      ></i>
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Comment;
