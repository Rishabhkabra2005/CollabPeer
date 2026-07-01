import OtherProfilePageComp from "../components/ProfilePage/OtherProfilePageComp";
import { fetchOtherUserProfile } from "../fetch/profile";
import { React, useEffect, useState } from "react";

// import ProfileHeaderImg from "../components/profileComponents/ProfileHeaderImg";
// import ProfileCard from "../components/profileComponents/ProfileCard";
// import ProfileProjectsSection from "../components/profileComponents/ProfileProjectsSection";
// import Navbar from "../components/Navbar/Navbar";

function OtherProfilePage() {
  let userId = window.location.pathname.split("/")[2];

  useEffect(() => {
    userId = window.location.pathname.split("/")[2];
  }, [window.location.pathname]);

  console.log(userId);
  if (userId === localStorage.getItem("user")) {
    window.location.href = "/profile";
  }
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchOtherUserProfile(userId)
      .then((res) => {
        setUser(res);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  return (
    <div className="h-[100vh] bg-[#f8f8f8]">
      <OtherProfilePageComp user={user} />
    </div>
  );
}

export default OtherProfilePage;
