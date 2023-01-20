import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Image from "../image-component/Image.component";
import { getSpecificCategory } from "../../utils/Firebase/Firebase.utils";
import { Spinner } from "../Spinner/spinner.component";
import { Fragment } from "react";
import Form from "react-bootstrap/Form";
const CategoriesPreview = () => {
  const params = useParams();
  const imageCategory = params.imageCategory;
  const [categoryArray, setCategoryArray] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getSpecificCategory(imageCategory);
      setCategoryArray(res);
      setLoading(false);
    };
    fetchCategories();
    // eslint-disable-next-line 
  }, []);
  function handleSortChange(e) {
    const sortOption = e.target.value;
    const newArray = categoryArray.slice();
    switch (sortOption) {
      case "1":
        newArray.sort((a, b) => b.imageViews - a.imageViews);
        break;
      case "2":
        newArray.sort((a, b) => a.imageViews - b.imageViews);
        break;
      case "3":
        newArray.sort((a, b) => b.likes - a.likes);
        break;
      case "4":
        newArray.sort((a, b) => a.likes - b.likes);
        break;
      default:
        break;
    }
    // call setState to re-render the component with the sorted array
    setCategoryArray(newArray);
  }

  return (
    <>
      {!loading ? (
        <>
        <h1>{imageCategory}</h1>
          <div className="filterSearch container-fluid">
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => handleSortChange(e)}
            >
              <option>Sort Images</option>
              <option value="1">Most Views</option>
              <option value="2">Least Views</option>
              <option value="3">Most Likes</option>
              <option value="4">Least Likes</option>
            </Form.Select>
          </div>
          <div className="column">
            {categoryArray.map((catObj, idx) => {
              return (
                <Fragment key={catObj.imageId}>
                  <Image catObj={catObj} />
                </Fragment>
              );
            })}
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default CategoriesPreview;
