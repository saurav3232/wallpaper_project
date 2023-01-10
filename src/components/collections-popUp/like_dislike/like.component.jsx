import { useState, useEffect } from "react";
import { checkLikedImage } from "../../../utils/Firebase/Firebase.utils";
import { useContext } from "react";
import { UserContext } from "../../../context/user.context";
import { toggleLikeValueDb } from "../../../utils/Firebase/Firebase.utils";
import { checkdisLikedImage } from "../../../utils/Firebase/Firebase.utils";
import { toggledisLikeValueDb } from "../../../utils/Firebase/Firebase.utils";
const Like = (props) => {
  const catObj = props.catObj;
  const [toggle_likes, set_toggle_Likes] = useState(false);
  const [toggle_dislikes, set_toggle_disLikes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    const checkLikeDislike = async () => {
      const likedValue = await checkLikedImage(currentUser, catObj.imageUrl);
      const dislikedValue = await checkdisLikedImage(
        currentUser,
        catObj.imageUrl
      );
      set_toggle_Likes(likedValue);
      set_toggle_disLikes(dislikedValue);
      setIsLoading(false);
    };
    checkLikeDislike();
    // eslint-disable-next-line
  }, []);

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

  return (
    <>
      {!isLoading ? (
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
      ) : (
        <></>
      )}
    </>
  );
};

export default Like;
