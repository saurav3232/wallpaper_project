import './App.css';
import Home from './routes/home/home.component';
import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import UserProfile from './components/UserProfile/userProfile.component';
import UploadWallpaper from './components/UploadWallpapers/uploadWallpaper.component';
import SignUp from './components/SignUp/signUp.component';
import { EditProfile } from './components/edit-profile/edit-profile.component';
import { RequireAuth } from './components/RequireAuth/RequireAuth.component';
function App() {
  return (
      <Routes>
       <Route path="/" element={<NavigationBar />}>
        <Route index element={<Home />}/>
        <Route path="signin" element={<Authentication />}/>
        <Route path="user" element={<RequireAuth><UserProfile /></RequireAuth>}/>
        <Route path="user/uploadWallpaper" element={<RequireAuth><UploadWallpaper /></RequireAuth>}/>
        <Route path="user/edit-profile" element={<RequireAuth><EditProfile /></RequireAuth>}/>
        <Route path="signup" element={<SignUp />}/>
        </Route>
    </Routes>
  );
}

export default App;
