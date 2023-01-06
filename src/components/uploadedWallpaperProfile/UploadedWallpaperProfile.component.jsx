import React from "react";
import { Fragment } from "react";
const UploadedWallpaperProfile = (props) => {
  const userInfo = props.userInfo;
  return (
    <>
      <h1>Uploaded Wallpapers</h1>
      <div id="carouselExampleUpload" className="carousel slide">
        <div className="carousel-inner" >
          {userInfo.myWallpapers.map((c, idx) => (
            <Fragment key={idx}>
              {idx === 0 ? (
                <div className="carousel-item active" key={idx}>
                  <img src={c} className="d-block w-100 " alt="..." />
                </div>
              ) : (
                <div className="carousel-item " key={idx}>
                  <img src={c} className="d-block w-100 " alt="..." />
                </div>
              )}
            </Fragment>
          ))}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleUpload"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleUpload"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      
    </>
  );
};

export default UploadedWallpaperProfile;
