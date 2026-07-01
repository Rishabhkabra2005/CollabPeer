import ProfilePageComp from "../components/ProfilePage/ProfilePageComp";
import { useSearchParams } from "react-router-dom";
import { fetchProfileFromServer } from "../fetch/profile";
import { React, useEffect, useState } from "react";

// import ProfileHeaderImg from "../components/profileComponents/ProfileHeaderImg";
// import ProfileCard from "../components/profileComponents/ProfileCard";
// import ProfileProjectsSection from "../components/profileComponents/ProfileProjectsSection";
// import Navbar from "../components/Navbar/Navbar";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (localStorage.getItem("user") == null) {
      localStorage.setItem("user", searchParams.get("user"));
      window.location.href="/feed";
    }
    if (user === null && localStorage.getItem("user") !== null) {
      fetchProfileFromServer(localStorage.getItem("user"))
        .then((response) => setUser(response))
        .catch((error) => console.error(error));
    }

    // console.log("user,", localStorage.getItem("user"));
  }, [user, searchParams]);

  return (
    <div className="min-h-[100vh] bg-[#f8f8f8]">
      <ProfilePageComp user={user} />
    </div>
  );
}

export default ProfilePage;
