import { useState } from "react";
import { setProfileImageHandler } from "../../utils/Firebase/Firebase.utils";
import { storage } from "../../utils/Firebase/Firebase.utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext } from "react";
import { v4 } from "uuid";
import { UserContext } from "../../context/user.context";
import { changeDisplayName,changeFacebookLink,changeInstagramLink } from "../../utils/Firebase/Firebase.utils";
export const EditProfile = () => {
    const [displayName,setDisplayName]=useState("");
    const [facebookId,setFacebookId]=useState("");
    const [instagramId,setInstagramId]=useState("");
    const [imageUpload,setImageUpload]=useState(null);
    const {currentUser}=useContext(UserContext);
    const uploadImageHandler=async()=>{
        if(imageUpload===null)
        {
          alert("No File Chosen")
          return;
        }
        const imageRef=ref(storage,`profilePics/${imageUpload.name+v4()}`)
        await uploadBytes(imageRef,imageUpload).then((snapshot)=>{
          getDownloadURL(snapshot.ref).then((url)=>{
            setProfileImageHandler(currentUser,url);
            alert("Profile Pic changed");
          });
        })
      }
      const resetFormFields=()=>{
        setDisplayName("");
        setFacebookId("");
        setInstagramId("");
        setImageUpload(null);
      }
      const onSubmitHandler=async (e)=>{
        e.preventDefault();
        await changeDisplayName(currentUser,displayName);
        await changeFacebookLink(currentUser,facebookId);
        await changeInstagramLink(currentUser,instagramId);
        await uploadImageHandler();
        alert("Information Updated");
        resetFormFields();
      }
    return (
    <div>
        <h1>Edit Your Profile:</h1>
        <form onSubmit={onSubmitHandler}>
        < div className="input-group mb-3">
            <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}/>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Display Name:</span>
          <input type="text" className="form-control" placeholder="Display Name" aria-label="Username" aria-describedby="basic-addon1" onChange={(e)=>setDisplayName(e.target.value)} value={displayName} />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Add/Change FacebookId:</span>
          <input type="text" className="form-control" placeholder="Facebook Id" aria-label="Username" aria-describedby="basic-addon1" onChange={(e)=>setFacebookId(e.target.value)} value={facebookId} />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Add/Change InstagramId</span>
          <input type="text" className="form-control" placeholder="Instagram id" aria-label="Username" aria-describedby="basic-addon1" onChange={(e)=>setInstagramId(e.target.value)} value={instagramId} />
        </div>
        <button type="submit">Save Changes</button>
        </form>
    </div>
  )
}
