import { checkImageInCollections } from "../utils/Firebase/Firebase.utils";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { CollectionsContext } from "../context/collections.context";
import { removeFromCollection } from "../utils/Firebase/Firebase.utils";
export const AddToCollection = (props) => {
  const imageUrl = props.imageUrl;
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [addToCollectionToggle, setAddToCollectionToggle] = useState(false);
  const {setTogglePopUpVal,setCollectionImageUrl}=useContext(CollectionsContext);
  useEffect(() => {
    const fetch = async () => {
      const val = await checkImageInCollections(currentUser.uid, imageUrl);
      setAddToCollectionToggle(val);
      setIsLoading(false);
    };
    fetch();
  });

  const addToCollectionsHandler = () => {
    if (currentUser === null) {
      alert("login to continue");
      return;
    }
    setTogglePopUpVal(true);
    setCollectionImageUrl(imageUrl);
  };
  const removeFromCollectionsHandler=async()=>{
    await removeFromCollection(currentUser.uid,imageUrl);
    setAddToCollectionToggle(false);
  } 
  return (
    <>
    {/* {console.log("add to collection rendered")} */}
      {!isLoading ? (
        <>
          {addToCollectionToggle ? (
            <i
              className="bi bi-bookmark-plus-fill icon-font-size"
              onClick={removeFromCollectionsHandler}
            ></i>
          ) : (
            <i
              className="bi bi-bookmark-plus icon-font-size"
              id="bookmark-btn"
              onClick={addToCollectionsHandler}
            ></i>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
