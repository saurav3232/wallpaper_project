import "./userProfile.styles.css";
import { Link } from "react-router-dom";
import { getUserData } from "../../utils/Firebase/Firebase.utils";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/user.context";
import Carousel from "../carousel/carousel.component";
import LikedWallpapers from "../likedWallpapers/likedWallpapers.component";
import UploadedWallpaperProfile from "../uploadedWallpaperProfile/UploadedWallpaperProfile.component";
const UserProfile = () => {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  console.log(currentUser);
  useEffect(() => {
    getUserData(currentUser.uid).then((res) => {
      console.log(res);
      setUserInfo(res);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {!isLoading ? (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-photo-container ">
              <img
                src={userInfo.profileImage}
                className="img-fluid img-thumbnail"
                alt="No pic set"
              />
            </div>
            <div className="profile-header-display-name">
              {userInfo.displayName}
            </div>
            <div className="profile-header-extra">
              <div className="profile-header-views">
                {userInfo.views}
                <div>Views</div>
              </div>
              <div className="profile-header-followers">
                {userInfo.following.length}
                <div>Followers</div>
              </div>
            </div>
          </div>
          {/* <div className="collections-container"> */}
          <h1>Your Collections:</h1>
          {userInfo.collections.length ? (
            <Carousel userInfo={userInfo} />
          ) : (
            <h1>No collections</h1>
          )}

          <div className="liked-wallpapers-container">
            {userInfo.likedWallpapers.length ? (
              <LikedWallpapers userInfo={userInfo} />
            ) : (
              <div>No liked Wallpapers</div>
            )}
          </div>
          <div className="uploaded Wallpapers">
            {userInfo.myWallpapers.length ? (
              <UploadedWallpaperProfile userInfo={userInfo} />
            ) : (
              <div>No wallpapers uploaded</div>
            )}
          </div>
          <div className="profile-links">
            {userInfo.facebookId ? (
              <a
                href={"https://" + userInfo.facebookId}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
            ) : (
              <div>No facebookId set</div>
            )}
            {userInfo.instagramId ? (
              <a
                href={"https://" + userInfo.instagramId}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            ) : (
              <div>No InstagramId set</div>
            )}
          </div>
          <div className="profile-editables">
            <Link to="uploadWallpaper" className="btn btn-warning">
              Upload Wallpaper
            </Link>
            <Link to="edit-profile" className="btn btn-info">
              Edit Profile
            </Link>
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
export default UserProfile;
