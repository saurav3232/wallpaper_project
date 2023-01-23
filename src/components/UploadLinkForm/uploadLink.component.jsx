import { useState } from "react"
import ShowTags from "../ShowTags/ShowTags.component";
import { useContext } from 'react';
import { UserContext } from '../../context/user.context';
import { addImageLinktoDb } from "../../utils/Firebase/Firebase.utils";
export const UploadLink = () => {
  const [tagArray,setTagArray]=useState([]);
  const [tagValue,setTagValue]=useState("");
  const [imageUrl,setImageUrl]=useState("");
  const [category,setCategory]=useState("");
  const {currentUser}=useContext(UserContext);
  const setCategoryHandler=(e)=>{
    setCategory(e.target.value);
  }
  const SeperateByComma=(str)=>{
    const arr=str.split(',');
    return arr;
  }
  const addTagHandler=()=>{
    if(tagArray.length!==0)
    {
      tagArray.forEach((tag)=>{
        if(tag===tagValue)
        {
          return;
        }
      })
    }
    const modTagVal=(tagValue).toLowerCase().replace(/\s/g,"");
    const seperatedArray=SeperateByComma(modTagVal);
    const newTagArray=tagArray.concat(seperatedArray);
    setTagArray(newTagArray);
    setTagValue("");
  }
  const setTagValueHandler=(e)=>{
    setTagValue(e.target.value)
  }
  const setImageUrlHandler=(e)=>{
    setImageUrl(e.target.value)
  }
  const resetFormFields=()=>{
    setTagArray([]);
    setCategory("");
    setTagValue("");
    setImageUrl("");
  }
  const onSubmitHandler=async(e)=>{
    e.preventDefault();
    const modCategory=(category).toLowerCase().replace(/\s/g,"");
    const imageDoc={
      imageUrl,
      tagArray,
      category:modCategory,
      userId:currentUser.uid
    }
    await addImageLinktoDb(imageDoc);
    resetFormFields();
  }
  const onTagKeyPressHandler=(e)=>{
    if(e.key==='Enter')
    {
      addTagHandler();
    }
  }
  return (
    <>
      {/* {console.log(tagArray)} */}
      <h1>Upload via Link</h1>
      <form onSubmit={onSubmitHandler}>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Image Url Link</span>
          <input type="text" className="form-control" placeholder="url link" aria-label="Username" aria-describedby="basic-addon1" value={imageUrl} onChange={setImageUrlHandler} required/>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Enter Category</span>
          <input type="text" className="form-control" placeholder="Category" aria-label="Username" aria-describedby="basic-addon1" value={category} onChange={setCategoryHandler} required/>
        </div>
        <ul>
          <li>Click on Add tags after entering tags</li>
          <li>Tags should be Seperated By ","</li>
          <li>Tags are required for improved searching</li>
        </ul>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Enter Tags </span>
          <input type="text" className="form-control" placeholder="Add Tag Seperated By ," aria-label="Username" aria-describedby="basic-addon1" value={tagValue} onChange={setTagValueHandler} onKeyPress={onTagKeyPressHandler}/>
          <button type="button" className="btn btn-primary" onClick={addTagHandler}>Add Tag</button>
        </div>
        <ShowTags props={{tagArray,setTagArray}}/>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </>
  )
}
