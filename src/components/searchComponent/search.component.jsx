import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { getQueryImage } from "../../utils/Firebase/Firebase.utils.js";
import Image from "../image-component/Image.component.jsx";
import { Fragment } from "react";
import { useContext } from "react";
import { CollectionsContext } from "../../context/collections.context";
import CollectionsPopUp from "../../components/collections-popUp/collections-popUp.component";
import Modal from "react-modal";
import Form from "react-bootstrap/Form";
import "./search.styles.css";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    backgroundColor: "rgb(129, 129, 234)",
  },
};
export const Search = () => {
  const { togglePopUpVal, setTogglePopUpVal } = useContext(CollectionsContext);
  const params = useParams();
  const searchImage = params.queryImage.trim();
  // console.log(params.queryImage);
  const [loading, setLoading] = useState(true);
  const [resultArray, setResultArray] = useState([]);
  useEffect(() => {
    const fetchImage = async () => {
      console.log("useEffect called");
      const modQuery = searchImage.toLowerCase().replace(/\s/g, "");
      const searchArray = await getQueryImage(modQuery);
      setResultArray(searchArray);
      setLoading(false);
    };
    fetchImage();
    // eslint-disable-next-line
  }, []);
  function handleSortChange(e) {
    const sortOption = e.target.value;
    const newArray = resultArray.slice();
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
    setResultArray( newArray);
  }

  return (
    <>
      {!loading ? (
        <div className="search-container">
          <h1>Search Results for "{searchImage}"</h1>
          {resultArray.length === 0 ? (
            <h1>Cannot find results for {searchImage}</h1>
          ) : (
            <>
              <Modal
                isOpen={togglePopUpVal}
                onRequestClose={() => setTogglePopUpVal(!togglePopUpVal)}
                style={customStyles}
                ariaHideApp={false}
              >
                <CollectionsPopUp />
              </Modal>
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
                {/* {console.log(resultArray)} */}
                {resultArray.map((catObj, idx) => {
                  return (
                    <Fragment key={catObj.imageId}>
                      <Image catObj={catObj} />
                    </Fragment>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
