import { useState, useEffect } from "react";
import { UserContext } from "../../context/user.context";
import { useContext } from "react";
import { getUserData } from "../../utils/Firebase/Firebase.utils";
import { addToFollowingHandler } from "../../utils/Firebase/Firebase.utils";
import { removeFromFollowingHandler } from "../../utils/Firebase/Firebase.utils";
export const Follow = (props) => {
  const { currentUser } = useContext(UserContext);
  const createrId = props.createrId;
  const [toggleFollow, setToggleFollow] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      const userSnapShot = await getUserData(currentUser.uid);
    //   console.log(userSnapShot.following);
      if (userSnapShot.following.includes(createrId)) {
        // console.log(true);
        setToggleFollow(true);
      }
      setLoading(false);
    };
    fetchUserData();
     // eslint-disable-next-line 
  }, []);
  const onAddToFollow=async()=>{
    if(currentUser.uid===createrId)
    {
        alert("Cannot follow yourself");
        return;
    }
    const userSnapShot=await getUserData(currentUser.uid);
    if(userSnapShot.following.includes(createrId))
    {
      alert("Already following, Please refresh to see changes");
      return;
    }
    // console.log(catObj);
    await addToFollowingHandler(currentUser.uid,createrId,userSnapShot);
    setToggleFollow(true);
  }
  const onRemoveFromFollow=async()=>{
    const userSnapShot=await getUserData(currentUser.uid);
    if(!userSnapShot.following.includes(createrId))
    {
      alert("Already unfollowed, Please refresh to see changes");
      return;
    }
    await removeFromFollowingHandler(currentUser.uid,createrId,userSnapShot);
    setToggleFollow(false);
  }
  return (
    <>
      {!currentUser ? (
        <button
          type="button"
          className="follow-btn btn btn-primary"
          onClick={() => alert("Login to Continue")}
        >
          <i className="bi bi-person-fill-add"></i>&nbsp;Follow
        </button>
      ) : (
        <>
          {!loading ? (
            <>
                {/* {console.log(toggleFollow)} */}
              {toggleFollow ? (
                <button type="button" className="follow-btn btn btn-primary" onClick={onRemoveFromFollow}>
                  <i className="bi bi-person-fill-add"></i>&nbsp;Following
                </button>
              ) : (
                <button
                  type="button"
                  className="follow-btn btn btn-primary"
                  onClick={onAddToFollow}
                >
                  <i className="bi bi-person-fill-add"></i>&nbsp;Follow
                </button>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};
