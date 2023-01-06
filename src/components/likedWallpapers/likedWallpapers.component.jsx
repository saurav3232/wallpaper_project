import React from "react";
import { Fragment } from "react";
const LikedWallpapers = (props) => {
  const userInfo = props.userInfo;
  console.log(userInfo);
  return (
    <>
      <h1>Liked Wallpapers</h1>
      <div id="carouselExampleLiked" className="carousel slide">
        <div className="carousel-inner" >
          {userInfo.likedWallpapers.map((c, idx) => (
            <Fragment key={idx}>
              {idx === 0 ? (
                <div className="carousel-item active" key={idx}>
                  <img src={c} className="d-block w-100 " alt="..."  />
                </div>
              ) : (
                <div className="carousel-item " key={idx}>
                  <img src={c} className="d-block w-100 " alt="..."  />
                </div>
              )}
            </Fragment>
          ))}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleLiked"
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
            data-bs-target="#carouselExampleLiked"
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

export default LikedWallpapers;
