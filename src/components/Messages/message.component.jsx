import { addUserReceipentMessage } from "../../utils/Firebase/Firebase.utils.js";
import { getUserData } from "../../utils/Firebase/Firebase.utils.js";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { UserContext } from "../../context/user.context";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { MessageContext } from "../../context/message.context.jsx";
import { addChatsToDb } from "../../utils/Firebase/Firebase.utils.js";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/Firebase/Firebase.utils.js";
import { Fragment } from "react";
import "./message.styles.css";
const Message = () => {
  const params = useParams();
  const createrId = params.userId;
  const [creater, setCreater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState("");
  const [chatArray, setChatArray] = useState([]);
  const [messageRefId, setMessageRefId] = useState("");
  const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line
  const { messagesArr, setMessagesArr } = useContext(MessageContext);
  useEffect(() => {
    const fetch = async () => {
      const createrData = await getUserData(createrId);
      if (currentUser) {
        const messagerefid =
          currentUser.uid > createrId
            ? currentUser.uid + createrId
            : createrId + currentUser.uid;
        setMessageRefId(messagerefid);
        const arr = await addUserReceipentMessage(
          messagerefid,
          setMessagesArr,
          messagesArr
        );
        setChatArray(arr);
        const docRef = doc(db, "chats", messagerefid);
        onSnapshot(docRef, (doc) => {
          setChatArray(...chatArray, doc.data().messages);
        });
      }
      setCreater(createrData);
      setLoading(false);
    };
    fetch();
    // eslint-disable-next-line
  }, [currentUser]);

  const onSendClickHandler = async () => {
    await addChatsToDb(messageRefId, chat, currentUser.uid);
    setChat("");
  };
  return (
    <>
      {currentUser ? (
        <>
          {!loading ? (
            <>
              {currentUser.uid === createrId ? (
                <h1>Cannot message Self</h1>
              ) : (
                <div className="message-wrapper">
                  {/* {console.log(chatArray)} */}
                  <div className="message-container">
                    <div className="message-header">
                      <img
                        src={creater.profileImage}
                        alt=""
                        className="message-header-profilePic "
                      />
                      <div className="message-header-displayName">
                        {creater.displayName}
                      </div>
                    </div>
                    {/* {console.log(chatArray)} */}
                    {chatArray !== undefined && chatArray.length > 0 ? (
                      <div className="chats-Container scrollbar-transparent">
                        {chatArray.map((chatMessage, idx) => (
                          <Fragment key={idx}>
                            {chatMessage.sender === currentUser.uid ? (
                              <>
                                <div key={idx} className="senderChat">
                                  <div className="senderChatContainer">
                                    {chatMessage.chat}
                                  </div>
                                  <div className="chat-extra">
                                    <div>
                                      {chatMessage.createdAt}
                                    </div>
                                    <div>
                                      {chatMessage.createdTime}
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div key={idx} className="receiverChat">
                                  <div className="receiverChatContainer">
                                    {chatMessage.chat}
                                  </div>
                                  <div className="chat-extra">
                                    <div>
                                      {chatMessage.createdAt}
                                    </div>
                                    <div>
                                      {chatMessage.createdTime}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className="message-footer">
                      <div className="input-group mb-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Write Message"
                          aria-label="Recipient's username"
                          aria-describedby="button-addon2"
                          value={chat}
                          onChange={(e) => {
                            setChat(e.target.value);
                          }}
                        />
                        <button
                          className="btn btn-info"
                          type="button"
                          id="button-addon2"
                          onClick={onSendClickHandler}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Spinner />
            </>
          )}
        </>
      ) : (
        <h1>Login to Continue</h1>
      )}
    </>
  );
};

export default Message;
