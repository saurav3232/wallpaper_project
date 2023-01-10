import React, { useState, Fragment} from "react";
import "./imageGrid.styles.css";
import Image from "../image-component/Image.component";
const ImageGrid = (props) => {
  // eslint-disable-next-line
  const [categoryArray, setCategoryArray] = useState(props.categoryArray);
  return (
    <>
      {/* {console.log("inside ImageGrid")} */}
      <div className="column">
        {categoryArray.map((catObj, idx) => {
          return (
            <Fragment key={idx}>
              <Image catObj={catObj} className="col-items" />
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

export default ImageGrid;
