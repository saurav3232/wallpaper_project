import React from "react";
import { useEffect, useState } from "react";
import { getCategoriesAndDocument } from "../../utils/Firebase/Firebase.utils";
import "./home.styles.css";
import { Categories } from "../../components/categories/categories.component";
import { useContext } from "react";
import { CollectionsContext } from "../../context/collections.context";
import CollectionsPopUp from "../../components/collections-popUp/collections-popUp.component";
import Modal from "react-modal";
// import { Outlet } from 'react-router-dom';
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    backgroundColor:"rgb(129, 129, 234)",
  },
};
const Home = () => {
  const [categories, setCategories] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { togglePopUpVal, setTogglePopUpVal} =useContext(CollectionsContext);
  useEffect(() => {
    const fetchData = async () => {
      const categoryMap = await getCategoriesAndDocument();
        setCategories(categoryMap);
        setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      {/* <button type="button" onClick={()=>{setBookmark(["hehe"])}}>Change</button> */}
      <div className="home-header">
        <h2>The best free Wallpapers</h2>
        <div className="home-header-input">
          <input
            type="text"
            className="form-control"
            id="basic-url"
            aria-describedby="basic-addon3"
            placeholder="Search Wallpapers"
          />
          <i className="fa-solid fa-magnifying-glass btn btn-primary"></i>
        </div>
      </div>
      <div>
        {/* {togglePopUpVal && <CollectionsPopUp/>} */}
        <Modal
          isOpen={togglePopUpVal}
          onRequestClose={() => setTogglePopUpVal(!togglePopUpVal)}
          style={customStyles}
          ariaHideApp={false}
        >
          <CollectionsPopUp />
        </Modal>
      </div>
      {!isLoading ? (
        < >
          <Categories categoryMap={categories}  />
        </>
      ) : (
        <div className="text-center  align-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
