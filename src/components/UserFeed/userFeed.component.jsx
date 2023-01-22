import React from "react";
import "./userFeed.styles.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/user.context";
import { Spinner } from "../Spinner/spinner.component";
import { getFeedInfo } from "../../utils/Firebase/Firebase.utils";
import ImageGrid from "../ImageGrid/imageGrid.component";
import { Fragment } from "react";
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
export const UserFeed = () => {
  const { currentUser } = useContext(UserContext);
  const { togglePopUpVal, setTogglePopUpVal } = useContext(CollectionsContext);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    const fetchFeed = async () => {
      if (currentUser) {
        const feedArray = await getFeedInfo(currentUser.uid);
        setFeed(feedArray);
        setLoading(false);
      }
    };
    fetchFeed();
  }, [currentUser]);
  return (
    <>
      {currentUser ? (
        <>
          {!loading ? (
            <div>
              <Modal
                isOpen={togglePopUpVal}
                onRequestClose={() => setTogglePopUpVal(!togglePopUpVal)}
                style={customStyles}
                ariaHideApp={false}
              >
                <CollectionsPopUp />
              </Modal>
              {feed.map((feedVal, idx) => (
                <Fragment key={idx}>
                  <h1>{feedVal.followerTitle}</h1>
                  <ImageGrid categoryArray={feedVal.imageObjects} />
                </Fragment>
              ))}
            </div>
          ) : (
            <Spinner />
          )}
        </>
      ) : (
        <h1>Please Login to view feeds</h1>
      )}
    </>
  );
};
