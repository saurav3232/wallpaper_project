import { useState} from "react";
import { Fragment } from "react";
import ImageGrid from "../ImageGrid/imageGrid.component";
import "./categories.styles.scss";
export const Categories = (props) => {
  // eslint-disable-next-line
  const [categoriesMap, setCategoriesMap] = useState(props.categoryMap);
  // console.log(categoriesMap);
  // const {bookmark,setBookmark}=useContext(CollectionsContext);
  //   const size=categoriesMap[0].arr.length;
  //   console.log(bookmark.slice(0,size));

  return (
    <div >
      {/* {console.log("inside Categories")} */}
      {categoriesMap.map((cat, idx) => (
        <Fragment key={idx} >
          <h3>{cat.category}</h3>
            <ImageGrid categoryArray={cat.arr} />
        </Fragment>
      ))}
    </div>
  );
};
