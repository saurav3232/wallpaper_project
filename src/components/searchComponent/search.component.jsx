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
  console.log(params.queryImage);
  const [loading, setLoading] = useState(true);
  const [resultArray, setResultArray] = useState([]);
  useEffect(() => {
    const fetchImage = async () => {
      const modQuery = searchImage.toLowerCase().replace(/\s/g, "");
      const searchArray = await getQueryImage(modQuery);
      setResultArray(searchArray);
      setLoading(false);
    };
    fetchImage();
    // eslint-disable-next-line
  }, []);
  //   console.log(searchImage);
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
              <div className="column">
                {resultArray.map((catObj, idx) => {
                  return (
                    <Fragment key={idx}>
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
