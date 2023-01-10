import React, { useEffect } from "react";
import "./Image.styles.css";
import { useState } from "react";
import {
  checkLikedImage,
  getUserData,
} from "../../utils/Firebase/Firebase.utils";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import { toggleLikeValueDb } from "../../utils/Firebase/Firebase.utils";
import { checkdisLikedImage } from "../../utils/Firebase/Firebase.utils";
import { toggledisLikeValueDb } from "../../utils/Firebase/Firebase.utils";
import { AddToCollection } from "../../addtoCollection/addtocollection.component";
import { Follow } from "../follow/follow.component";
const Image = (props) => {
  // eslint-disable-next-line
  const [catObj, setCatObj] = useState(props.catObj);
  const [creater, setCreater] = useState(null);
  const [toggle_likes, set_toggle_Likes] = useState(false);
  const [toggle_dislikes, set_toggle_disLikes] = useState(false);
  const { currentUser } = useContext(UserContext);
  const onlikeclickHandler = async () => {
    if (currentUser === null) {
      alert("Please login to continue");
      return;
    }
    if (toggle_dislikes) {
      await toggledisLikeValueDb(currentUser, catObj, toggle_dislikes);
      set_toggle_disLikes(!toggle_dislikes);
    }
    await toggleLikeValueDb(currentUser, catObj, toggle_likes);
    set_toggle_Likes(!toggle_likes);
  };
  const ondislikeclickHandler = async () => {
    if (currentUser === null) {
      alert("Please login to continue");
      return;
    }
    if (toggle_likes) {
      await toggleLikeValueDb(currentUser, catObj, toggle_likes);
      set_toggle_Likes(!toggle_likes);
    }
    await toggledisLikeValueDb(currentUser, catObj, toggle_dislikes);
    set_toggle_disLikes(!toggle_dislikes);
  };
  useEffect(() => {
    const userData = async () => {
      const createrSnapShot=await getUserData(catObj.userId)
      setCreater(createrSnapShot);
    };
    userData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const checkLike = async () => {
      const likedValue = await checkLikedImage(currentUser, catObj.imageUrl);
      set_toggle_Likes(likedValue);
    };
    checkLike();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const checkdisLike = async () => {
      const dislikedValue = await checkdisLikedImage(
        currentUser,
        catObj.imageUrl
      );
      set_toggle_disLikes(dislikedValue);
    };
    checkdisLike();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {creater !== null ? (
        <div className="image-container">
          <div className="middle2">
            <div className="text">
              <div className="fpart">
                <img
                  src={creater.profileImage}
                  alt="Img"
                  style={{ width: "50px", height: "50px" }}
                  className="profile-mini-img"
                />
                <div className="profile-mini-name">{creater.displayName}</div>
              </div>
              <Follow catObj={catObj}/>
            </div>
          </div>
          <img src={catObj.imageUrl} alt="Avatar" className="image" />
          <div className="middle">
            <div className="text">
              <div className="fpart">
                {!currentUser ? (
                  <>
                    <i
                      className="fa-regular fa-thumbs-up icon-font-size"
                      onClick={onlikeclickHandler}
                    ></i>
                    <i
                      className="fa-regular fa-thumbs-down icon-font-size"
                      onClick={ondislikeclickHandler}
                    ></i>
                  </>
                ) : (
                  <>
                    {toggle_likes === false ? (
                      <i
                        className="fa-regular fa-thumbs-up icon-font-size"
                        onClick={onlikeclickHandler}
                      ></i>
                    ) : (
                      <i
                        className="fa-solid fa-thumbs-up icon-font-size"
                        onClick={onlikeclickHandler}
                      ></i>
                    )}
                    {toggle_dislikes === false ? (
                      <i
                        className="fa-regular fa-thumbs-down icon-font-size"
                        onClick={ondislikeclickHandler}
                      ></i>
                    ) : (
                      <i
                        className="fa-solid fa-thumbs-down icon-font-size"
                        onClick={ondislikeclickHandler}
                      ></i>
                    )}
                  </>
                )}
              </div>
              {!currentUser ? (
                <i
                  className="bi bi-bookmark-plus icon-font-size"
                  id="bookmark-btn"
                  onClick={() => alert("login to continue")}
                ></i>
              ) : (
                <AddToCollection imageUrl={catObj.imageUrl} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Image;
