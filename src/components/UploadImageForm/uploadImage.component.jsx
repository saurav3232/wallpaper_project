import "./uploadImage.styles.css";
import { useState } from "react";
import ShowTags from "../ShowTags/ShowTags.component";
import { storage } from "../../utils/Firebase/Firebase.utils";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import { addImageLinktoDb } from "../../utils/Firebase/Firebase.utils";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const UploadImage = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [tagArray, setTagArray] = useState([]);
  const [tagValue, setTagValue] = useState("");
  const [category, setCategory] = useState("");
  const { currentUser } = useContext(UserContext);
  const setCategoryHandler = (e) => {
    setCategory(e.target.value);
  };
  const SeperateByComma = (str) => {
    const arr = str.split(",");
    return arr;
  };
  const addTagHandler = () => {
    const modTagVal = tagValue.toLowerCase().replace(/\s/g, "");
    const seperatedArray = SeperateByComma(modTagVal);
    const newTagArray = tagArray.concat(seperatedArray);
    setTagArray(newTagArray);
  };
  const setTagValueHandler = (e) => {
    setTagValue(e.target.value);
  };
  const onTagKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      addTagHandler();
    }
  };
  const resetFormFields = () => {
    setTagArray([]);
    setCategory("");
    setTagValue("");
    setImageUpload(null);
    setImageUrl("");
  };
  const uploadImageHandler = () => {
    if (imageUpload === null) {
      alert("No File Chosen");
      return;
    }
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      alert("image Uploaded");
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
      });
    });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const modCategory = category.toLowerCase().replace(/\s/g, "");
    const imageDoc = {
      imageUrl,
      tagArray,
      category: modCategory,
      userId: currentUser.uid,
    };
    await addImageLinktoDb(imageDoc);
    resetFormFields();
  };
  return (
    <div>
      <h4>Click on upload after choosing Image</h4>
      <form onSubmit={onSubmitHandler}>
        <div className="UploadImageContainer">
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
            required
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={uploadImageHandler}
          >
            {" "}
            Upload Image
          </button>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            Enter Category
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={category}
            onChange={setCategoryHandler}
            required
          />
        </div>
        <ul>
          <li>Click on Add tags after entering tags</li>
          <li>Tags should be Seperated By ","</li>
          <li>Tags are required for improved searching</li>
        </ul>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            Enter Tags{" "}
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Add Tag "
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={tagValue}
            onChange={setTagValueHandler}
            onKeyPress={onTagKeyPressHandler}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={addTagHandler}
          >
            Add Tag
          </button>
        </div>
        <ShowTags props={{ tagArray, setTagArray }} />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
