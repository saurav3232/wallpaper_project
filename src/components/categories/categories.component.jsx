import { useState } from "react";
import { Fragment } from "react";

import "./categories.styles.scss";
import { Link } from "react-router-dom";
import Image from "../image-component/Image.component";
export const Categories = (props) => {
  // eslint-disable-next-line
  const [categoriesMap, setCategoriesMap] = useState(props.categoryMap);
  // console.log(categoriesMap);
  // const {bookmark,setBookmark}=useContext(CollectionsContext);
  //   const size=categoriesMap[0].arr.length;
  //   console.log(bookmark.slice(0,size));

  return (
    <div>
      {/* {console.log("inside Categories")} */}
      {categoriesMap.map((cat, idx) => (
        <Fragment key={idx}>
          <div style={{display:"flex",justifyContent:"space-between",flexFlow:"wrap"}}>
            <h3>{cat.category}</h3>
            <Link to={`/category/${cat.category}`}>View More</Link>
          </div>
          {/* <ImageGrid categoryArray={cat.arr} /> */}
          <div className="column">
            {cat.arr
              .filter((_, idx) => idx < 4)
              .map((catObj) => (
                <Image catObj={catObj} />
              ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
