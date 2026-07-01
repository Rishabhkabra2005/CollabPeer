import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import DiscussionForum from "./pages/DiscussionForum";
import Projects from "./pages/Projects";
import ProjectView from "./pages/ProjectView";
import CourseReview from "./pages/CourseReview";
import OtherProfilePage from "./pages/OtherProfilePage";
import SearchPage from "./pages/SearchPage";
import DiscussionView from "./pages/discussionView";
import CourseView from "./pages/courseView";
import { Navigate } from "react-router-dom";
import EditProfileCard from "./components/ProfilePage/EditProfileCard";
import GroupChat from "./pages/GroupChat";

function App() {
  const user = localStorage.getItem("user");
  console.log("user", user);

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<OtherProfilePage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/discussion" element={<DiscussionForum />} />
        <Route path="/discussionView" element={<DiscussionView />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projectview" element={<ProjectView />} />
        <Route path="/courseReview" element={<CourseReview />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/courseView" element={<CourseView />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/community" element={<GroupChat/>} />
        <Route path="/editProfile" element={<EditProfileCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
