import { useEffect, useState} from "react";
import "./ImagePage.styles.css";
import { getUserData } from "../../utils/Firebase/Firebase.utils";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import { checkLikedImage } from "../../utils/Firebase/Firebase.utils";
import { checkdisLikedImage } from "../../utils/Firebase/Firebase.utils";
import { Spinner } from "react-bootstrap";
import { Follow } from "../follow/follow.component";
import { toggleLikeValueDb } from "../../utils/Firebase/Firebase.utils";
import { toggledisLikeValueDb } from "../../utils/Firebase/Firebase.utils";
import { addNotificationOnLike } from "../../utils/Firebase/Firebase.utils";
import { useParams } from "react-router-dom";
import { getSpecificImageInfo } from "../../utils/Firebase/Firebase.utils";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../utils/Firebase/Firebase.utils";
import { AddToCollection } from "../../addtoCollection/addtocollection.component";
import CollectionsPopUp from "../collections-popUp/collections-popUp.component";
import Modal from "react-modal";
import { CollectionsContext } from "../../context/collections.context";
import { Link } from "react-router-dom";
import Comment from "../comments/comment.component";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    backgroundColor: "rgb(129, 129, 234)",
  },
};
export const ImagePage = () => {
  // const elementRef = useRef(null);

  // eslint-disable-next-line
  const { togglePopUpVal, setTogglePopUpVal } = useContext(CollectionsContext);
  const params = useParams();
  const imageCategory = params.imgCategory;
  const imageId = params.imgId;
  const { currentUser } = useContext(UserContext);
  const [creater, setcreater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggle_likes, set_toggle_Likes] = useState(false);
  const [toggle_dislikes, set_toggle_disLikes] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [imageObj, setImageObj] = useState(null);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const func = async () => {
      getSpecificImageInfo(imageCategory, imageId).then(async (res) => {
        setImageObj(res);
        if (res !== null) {
          const contributer = await getUserData(res.userId);
          setcreater(contributer);
        }
        if (currentUser !== null) {
          const likeVal = await checkLikedImage(currentUser, res.imageUrl);
          const dislikeVal = await checkdisLikedImage(
            currentUser,
            res.imageUrl
          );
          onSnapshot(doc(db, "images", imageCategory), (doc) => {
            doc.data().arr.forEach((imgObj) => {
              if (imgObj.imageId === imageId) {
                setTotalLikes(imgObj.likes);
              }
            });
          });
          onSnapshot(doc(db, "images", imageCategory), (doc) => {
            doc.data().arr.forEach((imgObj) => {
              if (imgObj.imageId === imageId) {
                setDislikes(imgObj.dislikes);
              }
            });
          });
          set_toggle_Likes(likeVal);
          set_toggle_disLikes(dislikeVal);
        }
      });
      // console.log(imageObj);
      setLoading(false);
    };
    func();
    // eslint-disable-next-line
  }, [currentUser]);
  const onlikeclickHandler = async () => {
    if (currentUser === null) {
      alert("Please login to continue");
      return;
    }
    if (toggle_dislikes) {
      await toggledisLikeValueDb(currentUser, imageObj, toggle_dislikes);
      set_toggle_disLikes(!toggle_dislikes);
    }
    await toggleLikeValueDb(currentUser, imageObj, toggle_likes);
    if (!toggle_likes) {
      await addNotificationOnLike(
        currentUser.uid,
        imageObj.userId,
        imageObj.imageUrl
      );
    }
    set_toggle_Likes(!toggle_likes);
  };
  const ondislikeclickHandler = async () => {
    if (currentUser === null) {
      alert("Please login to continue");
      return;
    }
    if (toggle_likes) {
      await toggleLikeValueDb(currentUser, imageObj, toggle_likes);
      set_toggle_Likes(!toggle_likes);
    }
    await toggledisLikeValueDb(currentUser, imageObj, toggle_dislikes);
    set_toggle_disLikes(!toggle_dislikes);
  };

  const download = async () => {

     fetch(imageObj.imageUrl,{
      mode:"no-cors",

    })
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.jpeg';
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
    
  };

  return (
    <>
      {/* {console.log(imageObj)} */}
      {!loading && creater ? (
        <>
          <Modal
            isOpen={togglePopUpVal}
            onRequestClose={() => setTogglePopUpVal(!togglePopUpVal)}
            style={customStyles}
            ariaHideApp={false}
          >
            <CollectionsPopUp />
          </Modal>
          <div className="imagePageContainer">
            <div className="imagePageHeader">
              <Link
                style={{ textDecoration: "none" }}
                to={{ pathname: `/creater/${imageObj.userId}` }}
              >
                <div className="imagePageHeaderCreater">
                  <img
                    src={creater.profileImage}
                    alt=""
                    className="imagePageHeaderProfile"
                  />
                  <h3>{creater.displayName}</h3>
                </div>
              </Link>
              <div className="imagePageFollow">
                <Follow createrId={imageObj.userId} />
              </div>
            </div>
            <div className="container-fluid">
              <div className=" row ">
                <div
                  className="col-md-6 col-sm-12"
                  id="canva"
                  // ref={elementRef}
                >
                  <img src={imageObj.imageUrl} alt="" className="img-fluid" />
                </div>
                <div className="ImagePageImageDetails col-md-6 col-sm-12">
                  Image Details
                  <div className="fpart-wrapper">
                    <div className="fpart ">
                      {!currentUser ? (
                        <>
                          <span>{totalLikes}</span>
                          <i
                            className="fa-regular fa-thumbs-up icon-font-size"
                            onClick={onlikeclickHandler}
                          ></i>
                          <span>{dislikes}</span>
                          <i
                            className="fa-regular fa-thumbs-down icon-font-size"
                            onClick={ondislikeclickHandler}
                          ></i>
                        </>
                      ) : (
                        <>
                          {/* {console.log(totalLikes)} */}
                          <span>{totalLikes}</span>
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
                          <span>{dislikes}</span>
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
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={download}
                    >
                      Download Image
                    </button>
                    {!currentUser ? (
                      <i
                        className="bi bi-bookmark-plus icon-font-size"
                        id="bookmark-btn"
                        onClick={() => alert("login to continue")}
                      ></i>
                    ) : (
                      <AddToCollection imageUrl={imageObj.imageUrl} />
                    )}
                  </div>
                    {!currentUser?(
                      <h1>Login to Access Comments</h1>
                    ):(
                      <>
                        <Comment imageId={imageId} imageCategory={imageCategory} createrId={imageObj.userId}/>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};
