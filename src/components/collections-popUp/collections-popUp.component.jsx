import { UserContext } from "../../context/user.context";
import { Fragment, useContext, useEffect, useState } from "react";
import { getUserData } from "../../utils/Firebase/Firebase.utils";
import { CollectionsContext } from "../../context/collections.context";
import { Spinner } from "../Spinner/spinner.component";
import "./collections-popUp.styles.css";
import { updateCollections } from "../../utils/Firebase/Firebase.utils";
const CollectionsPopUp = () => {
  const { currentUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const { setTogglePopUpVal} = useContext(CollectionsContext);
  const [collectionTitle,setCollectionTitle]=useState("");
  useEffect(() => {
    getUserData(currentUser.uid).then((res) => {
      setUserInfo(res);
    });
    // eslint-disable-next-line
  }, []);
  const {collection_imageUrl}=useContext(CollectionsContext);
  // console.log(toggleVal,setTogglePopUp);
  const saveCollectionsPopUp=async ()=>{
    if(collectionTitle==='DEFAULT' || collectionTitle==="")
    {
      alert("please choose or create a collection");
      return;
    }
    await updateCollections(currentUser.uid,collection_imageUrl,collectionTitle);
    alert("Added Collection");
    setTogglePopUpVal(false)
  }
  return (
    <>
      {userInfo ? (
        <>
          <div id="popup1" className="overlay">
            <div className="popup">
              <div className="title-name">
                <h4>Add Collection</h4>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => {setTogglePopUpVal(false)}}></button>
              </div>
              <div className="sel-collection">
                {/* <div>Choose collection</div> */}
                <select
                  className="form-select"
                  aria-label="Default select example"
                  defaultValue={'DEFAULT'}
                  onChange={(e)=>{setCollectionTitle(e.target.value)}}
                >
                  <option  value="">choose collection</option>
                  {userInfo.collections.map((obj, idx) => (
                    <Fragment key={idx}>
                      <option defaultValue={obj.title}>{obj.title}</option>
                    </Fragment>
                  ))}
                </select>
              </div>
              <br />
              <div style={{ textAlign: "center" }}>Or</div>
              <br />
              <div className="mb-3 add-coll">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Create Collection"
                  value={collectionTitle}
                  onChange={(e)=>setCollectionTitle(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-success"
                onClick={saveCollectionsPopUp}
              >
                Save
              </button>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};
export default CollectionsPopUp;
