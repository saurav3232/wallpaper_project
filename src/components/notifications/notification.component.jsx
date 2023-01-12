import Dropdown from "react-bootstrap/Dropdown";
import "./notifications.styles.css";
import { useContext } from "react";
import { NotificationContext } from "../../context/notification.context";
import { UserContext } from "../../context/user.context";
import { Fragment } from "react";
import { removeFromUnreadHandler } from "../../utils/Firebase/Firebase.utils";
import { clearNotifications } from "../../utils/Firebase/Firebase.utils";
export const Notifications = () => {
  const {
    unReadMessages,
    notificationsArr,
    setUnreadMessages,
    setNotificationArr,
  } = useContext(NotificationContext);
  const { currentUser } = useContext(UserContext);
  const onRemoveFromUnread = async (notification) => {
    const newUnread = await removeFromUnreadHandler(
      notification,
      setNotificationArr,
      currentUser.uid,
      unReadMessages
    );
    setUnreadMessages(newUnread);
  };
  const checkIncludedInUnread = (notification) => {
    let flag = false;
    unReadMessages.forEach((notifi) => {
      if (notifi.message === notification.message && notifi.notificationId===notification.notificationId) {
        flag = true;
      }
    });
    return flag;
  };
  const clearNotificationsHandler=async()=>{
    await clearNotifications(currentUser.uid,setNotificationArr);
    setUnreadMessages([]);
  }
  // console.log(unReadMessages);
  return (
    <>
      {/* {console.log("rendered")} */}
      {currentUser ? (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <i
              type="button"
              className="fa-regular fa-bell btn btn-success position-relative"
            >
              {unReadMessages.length !== 0 ? (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unReadMessages.length}
                  <span className="visually-hidden">unread messages</span>
                </span>
              ) : (
                <></>
              )}
            </i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <>
              {notificationsArr.length !== 0 ? (
                <>
                  {notificationsArr.map((notification, idx) => (
                    <Fragment key={idx}>
                      {checkIncludedInUnread(notification) ? (
                        <Dropdown.Item>
                          <div
                            className="dropdown-Subpart"
                            onClick={() => onRemoveFromUnread(notification)}
                          >
                            {notification.message}
                          </div>
                          <div>
                            <i
                              className="bi bi-check-square-fill dropdown-Subpart"
                              onClick={() => onRemoveFromUnread(notification)}
                            ></i>
                          </div>
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item>{notification.message}</Dropdown.Item>
                      )}
                    </Fragment>
                  ))}
                  <Dropdown.Item><button onClick={clearNotificationsHandler} className="btn btn-danger">Clear Notifications</button></Dropdown.Item>
                </>
              ) : (
                <Dropdown.Item>No notifications to Show</Dropdown.Item>
              )}
            </>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <i
          type="button"
          className="fa-regular fa-bell btn btn-success position-relative"
          onClick={() => {
            alert("Login to continue");
          }}
        ></i>
      )}
    </>
  );
};
