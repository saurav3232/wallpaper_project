import "./userProfile.styles.css";
import { Link } from "react-router-dom";
import { getUserData } from "../../utils/Firebase/Firebase.utils";
import { useContext, useState,useEffect } from "react";
import { UserContext } from "../../context/user.context";
const UserProfile = () => {
  const {currentUser}=useContext(UserContext);
  const [isLoading,setLoading]=useState(true);
  const [userInfo,setUserInfo]=useState(null);
  console.log(currentUser);
  useEffect(() => {
    getUserData(currentUser.uid).then((res)=>{
      console.log(res)
      setUserInfo(res);
      setLoading(false);
    })
  }, [])

  return (
    <>
      {!isLoading?
      (<div className="profile-container">
        <div className="profile-header">
          <div className="profile-photo-container ">
            <img src={userInfo.profileImage} className="img-fluid" alt="No pic set" />
          </div>
          <div className="profile-header-display-name">{userInfo.displayName}</div>
          <div className="profile-views">Total Views:{userInfo.views}</div>
          <div className="profile-views">Followers:{userInfo.following.length}</div>
        </div>
        <div className="collections-container">
          <h3>Your Collections:</h3>
          {userInfo.collections.length?(
            <div>
              {userInfo.collections.map((col,idx)=>(
                <div key={idx}>
                  <h1>{col.title}</h1>
                  <div>
                    {col.arr.map((c,idx)=>( 
                      <img src={c} alt="" key={idx} className="img-fluid"/>
                    ))}
                  </div>
                </div>
              ))}
              </div>
          ):(<div>No collections</div>)
          }
        </div>
        <div className="liked-wallpapers-container">
          <h3>Liked Wallpapers:</h3>
          {userInfo.likedWallpapers.length?(<div>Wallpaper</div>):(<div>No liked Wallpapers</div>)
          }
        </div>
        <div className="uploaded Wallpapers">
          <h1>Uploaded Wallpapers</h1>
            {userInfo.myWallpapers.length?(<div>
              {userInfo.myWallpapers.map((wallpaper,idx)=>(
                <div key={idx}>
                  <img src={wallpaper} className="img-fluid" alt=""/>
                </div>
              ))}
            </div>):(<div>No wallpapers uploaded</div>)}
        </div>
        <div>
          <Link to='uploadWallpaper'>Upload Wallpaper</Link>
        </div>
        <div>
          <Link to='edit-profile'>Edit Profile</Link>
        </div>
        <div className="profile-links">
            {userInfo.facebookId?(<a href={"https://"+userInfo.facebookId} target="_blank" rel="noreferrer">
          Facebook
        </a>):(<div>
              No facebookId set
            </div>)}
            {userInfo.instagramId?(<a href={"https://"+userInfo.instagramId} target="_blank" rel="noreferrer">
            Instagram
        </a>):(<div>
              No InstagramId set
            </div>)}
        </div>
      </div>)
      :(<h1>Loading....</h1>)
      }
    </>
  );
};
export default UserProfile;
