import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Topbar from "../components/Navbar/Topbar";
import fetchProfilesBySearch from "../fetch/search";
import ProfileUnit from "../components/Search/ProfileUnit";

function SearchPage() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    fetchProfilesBySearch(search)
      .then((res) => {
        res = res.filter(
          (profile) => profile._id !== localStorage.getItem("user")
        );
        setProfiles(res);
      })
      .catch((err) => console.log(err));
  }, [search]);

  console.log(hover);

  return (
    <div className="relative flex flex-col md:flex-row bg-[#F8F8F8] w-screen min-h-[100vh]">
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        select={{ search: true }}
      />
      <div className="w-screen">
        <Topbar title="Search" isSearchDisabled={true} />
        <div className="ml-[8vw] md:ml-[40vw] ">
          <div
            className={`flex ${
              hover ? " border-[1px] border-[#0016DA] " : ""
            } pl-0 items-center bg-white shadow-sm mt-10 mb-10 w-[50vw] md:w-[40vw] h-[2.5rem] rounded-xl overflow-hidden`}
          >
            <img
              src="images/search.svg"
              alt="search icon"
              className="w-[1rem] h-[1rem] m-2 hover:cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search for users"
              className="md:w-[20vw] w-[20vw] h-full focus:outline-none"
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setHover(true)}
              onBlur={() => setHover(false)}
            />
          </div>
        </div>

        <div className="md:ml-[40vw] w-[90vw] m-auto md:w-[40vw]">
          {profiles.map((profile) => (
            <ProfileUnit key={profile.id} user={profile} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;