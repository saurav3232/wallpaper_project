import "../UserProfile/userProfile.styles.css"
import { useParams } from "react-router-dom";
import { getUserData } from "../../utils/Firebase/Firebase.utils";
import {  useState, useEffect } from "react";
import { Follow } from "../follow/follow.component";
import ImageGrid from "../ImageGrid/imageGrid.component";
import { collectImageObjects } from "../../utils/Firebase/Firebase.utils";
import { useContext } from "react";
import { CollectionsContext } from "../../context/collections.context";
import CollectionsPopUp from "../../components/collections-popUp/collections-popUp.component";
import Modal from "react-modal";
const CreaterProfile = () => {
  const [isLoading, setLoading] = useState(true);
  const [creater, setCreater] = useState(null);
  const [categoryArray,setCategoryArray]=useState(null);
  const params=useParams();
  const { togglePopUpVal, setTogglePopUpVal} =useContext(CollectionsContext);
  const createrId=params.userId;
  // console.log(createrId);
  useEffect(() => {
    const fetchCreaterData=async()=>{
        const data=await getUserData(createrId);
        setCategoryArray(await collectImageObjects(createrId));
        setCreater(data);
        setLoading(false);
    }
    fetchCreaterData();
    // eslint-disable-next-line
  }, []);
  // console.log(creater)
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "100vw",
      backgroundColor:"rgb(129, 129, 234)"
    },
  };
  return (
    <>
      {!isLoading ? (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-photo-container ">
              <img
                src={creater.profileImage}
                className="img-fluid img-thumbnail"
                alt="No pic set"
              />
            </div>
            <div className="profile-header-display-name">
              {creater.displayName}
            </div>
            <Follow createrId={createrId}/>
            <div className="profile-header-extra">
              <div className="profile-header-views">
                {creater.views}
                <div>Views</div>
              </div>
              <div className="profile-header-followers">
                {creater.followedBy.length}
                <div >Followers</div>
              </div>
              <div style={{display:"flex",alignItems:"center"}}>
                <button type="button" className="btn btn-info" >Message</button>
              </div>
            </div>
          </div>
        
          <div>
        {/* {togglePopUpVal && <CollectionsPopUp/>} */}
        <Modal
          isOpen={togglePopUpVal}
          onRequestClose={() => setTogglePopUpVal(!togglePopUpVal)}
          style={customStyles}
          ariaHideApp={false}
        >
          <CollectionsPopUp />
        </Modal>
      </div>
          <h1>Uploaded Wallpapers</h1>
          <ImageGrid categoryArray={categoryArray}/>
          <div className="profile-links">
            {creater.facebookId ? (
              <a
                href={"https://" + creater.facebookId}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
            ) : (
              <div>No facebookId set</div>
            )}
            {creater.instagramId ? (
              <a
                href={"https://" + creater.instagramId}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            ) : (
              <div>No InstagramId set</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center  align-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};
export default CreaterProfile;
