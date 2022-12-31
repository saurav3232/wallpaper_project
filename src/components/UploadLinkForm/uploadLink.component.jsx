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
    const newTagArray=[...tagArray,tagValue]
    setTagArray(newTagArray)
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
    const imageDoc={
      imageUrl,
      tagArray,
      category,
      userId:currentUser.uid
    }
    await addImageLinktoDb(imageDoc);
    resetFormFields();
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
          <input type="text" className="form-control" placeholder="Category" aria-label="Username" aria-describedby="basic-addon1" value={category} onChange={setCategoryHandler}/>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Enter Tags </span>
          <input type="text" className="form-control" placeholder="Add Tag" aria-label="Username" aria-describedby="basic-addon1" value={tagValue} onChange={setTagValueHandler}/>
          <button type="button" className="btn btn-primary" onClick={addTagHandler}>Add Tag</button>
        </div>
        <ShowTags props={{tagArray,setTagArray}}/>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </>
  )
}