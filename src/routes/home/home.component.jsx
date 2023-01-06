import React from "react";
import { useEffect, useState } from "react";
import { getCategoriesAndDocument } from "../../utils/Firebase/Firebase.utils";
import "./home.styles.css";
import { Categories } from "../../components/categories/categories.component";
// import { Outlet } from 'react-router-dom';
const Home = () => {
  const [categories, setCategories] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const categoryMap = await getCategoriesAndDocument();
      setCategories(categoryMap);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div >
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
      {!isLoading ? (
        <>
          <Categories categoryMap={categories} />
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
