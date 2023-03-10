import "./App.css";
import Home from "./routes/home/home.component";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import UserProfile from "./components/UserProfile/userProfile.component";
import UploadWallpaper from "./components/UploadWallpapers/uploadWallpaper.component";
import SignUp from "./components/SignUp/signUp.component";
import { EditProfile } from "./components/edit-profile/edit-profile.component";
import { RequireAuth } from "./components/RequireAuth/RequireAuth.component";
import CreaterProfile from "./components/CreaterProfile/createrProfile.component";
import Message from "./components/Messages/message.component";
import { ImagePage } from "./components/imagePage/ImagePage.component";
import { Search } from "./components/searchComponent/search.component";
import CategoriesPreview from "./components/categoriesPreview/categoriesPreview.compnent";
import Leaderboard from "./components/leaderBoard/leaderBoard.component";
// import { UserFeed } from "./components/UserFeed/UserFeed.component";
import {UserFeed} from "./components/UserFeed/userFeed.component.jsx"
function App() {
  return (
    <Routes>
      <Route path="/" element={<NavigationBar />}>
        <Route index element={<Home />} />
        <Route path="signin" element={<Authentication />} />
        <Route
          path="user"
          element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          }
        />
        <Route path="creater/:userId" element={<CreaterProfile />} />
        <Route path="creater/:userId/message" element={<Message />} />
        <Route
          path="user/uploadWallpaper"
          element={
            <RequireAuth>
              <UploadWallpaper />
            </RequireAuth>
          }
        />
        <Route
          path="user/edit-profile"
          element={
            <RequireAuth>
              <EditProfile />
            </RequireAuth>
          }
        />
        <Route path="image/:imgCategory/:imgId" element={<ImagePage />} />
        <Route path="search/:queryImage" element={<Search />} />
        <Route path="category/:imageCategory" element={<CategoriesPreview />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="myfeed" element={<UserFeed />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}

export default App;
