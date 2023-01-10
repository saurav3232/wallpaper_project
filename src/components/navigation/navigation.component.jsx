import "./navigation.styles.css";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import { signOutUser } from "../../utils/Firebase/Firebase.utils";
import { Notifications } from "../notifications/notification.component";
const NavigationBar = () => {
  const { currentUser } = useContext(UserContext);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-5-strong">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            Wallpaper Project
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                {currentUser ? (
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    as="span"
                    onClick={signOutUser}
                  >
                    Sign Out
                  </NavLink>
                ) : (
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/signin"
                  >
                    Sign In
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active" to="/user">
                  My Profile
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li>
                <Notifications />
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavigationBar;
