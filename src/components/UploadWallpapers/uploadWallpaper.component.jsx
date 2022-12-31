import { useState } from "react"
import { UploadImage } from "../UploadImageForm/uploadImage.component";
import { UploadLink } from "../UploadLinkForm/uploadLink.component";
const UploadWallpaper=()=> {
  const [uploadComponet,setUploadComponet]=useState(null);
  const linkClickHandler=()=>{
    // alert("link button clicked")
    setUploadComponet(<UploadLink/>)
  }
  const fileClickHandler=()=>{
    // alert("file button clicked")
    setUploadComponet(<UploadImage/>)

  }
  return (
    <div>
        {/* {console.log("rendered")} */}
        <h1>Become a Contributor:</h1>
        <div className="check-box-container">
          <h3>Choose upload type:</h3>
        <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={linkClickHandler}/>
            <label className="form-check-label" >
              Upload via Link
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={fileClickHandler}/>
            <label className="form-check-label" >
              Upload Images from Pc
            </label>
          </div>
        </div>
        {uploadComponet}
    </div>
  )
}
export default UploadWallpaper