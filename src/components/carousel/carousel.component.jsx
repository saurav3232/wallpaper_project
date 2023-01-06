import React, { Fragment } from "react";
import "./carousel.styles.css";
const Carousel = (props) => {
  const userInfo = props.userInfo;
  return (
    <>
      {userInfo.collections.map((col, idx) => (
        <Fragment key={idx}>
          <h3>{col.title}</h3>
          <div
            id={`carouselExample${idx}`}
            className="carousel slide"
            key={idx}
          >
            <div className="carousel-inner" key={idx}>
              {col.arr.map((c, idx) => (
                <Fragment key={idx}>
                  {idx === 0 ? (
                    <div className="carousel-item active" key={idx}>
                      <img
                        src={c}
                        className="d-block w-100 "
                        alt="..."
                      />
                    </div>
                  ) : (
                    <div className="carousel-item " key={idx}>
                      <img
                        src={c}
                        className="d-block w-100 "
                        alt="..."
                      />
                    </div>
                  )}
                </Fragment>
              ))}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carouselExample${idx}`}
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
                data-bs-target={`#carouselExample${idx}`}
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
        </Fragment>
      ))}
    </>
  );
};

export default Carousel;
