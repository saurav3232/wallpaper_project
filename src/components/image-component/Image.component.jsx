import React from "react";
import "./Image.styles.css";
import { useState } from "react";
const Image = (props) => {
  // eslint-disable-next-line
  const [catObj, setCatObj] = useState(props.catObj);
  return (
    <div className="image-container">
      <div className="middle2">
        <div className="text">
          <div className="fpart">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7GoLl5TulaocWLQ8pi__zObTN8Sj5PmFvec-6NEPb&s" alt="Img" style={{width:"50px",height:"50px"}} className="profile-mini-img"/>
            <div className="profile-mini-name">Name</div>
          </div>
          <button type="button" className="follow-btn btn btn-primary"><i class="bi bi-person-fill-add"></i>&nbsp;Follow</button>
        </div>
      </div>
      <img src={catObj.imageUrl} alt="Avatar" className="image" />
      <div className="middle">
        <div className="text">
          <div className="fpart">
            <i className="fa-regular fa-thumbs-up icon-font-size"></i>
            <i className="fa-regular fa-thumbs-down ms-3 icon-font-size"></i>
          </div>
          <i class="bi bi-bookmark-plus icon-font-size"></i>
        </div>
      </div>
    </div>
  );
};

export default Image;
