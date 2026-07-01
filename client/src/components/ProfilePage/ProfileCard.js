import React from "react";
import ProfileName from "./ProfileName";
import { Link } from "react-router-dom";

const ProfileCard = (props) => {
  const user = props.user;

  return (
    <div className="fixed top-[6rem] left-[6rem] flex flex-col items-center bg-[#FFFFFFEE] w-[25vw] py-[1.5rem] rounded-xl shadow-xl duration-[0.4s] hover:scale-105 hover:shadow-md hover:cursor-pointer">
      <div className={`border-8 border-[#0016DA99] shadow-2xl bg-cover w-[9rem] h-[9rem] rounded-full`}>
        <img
          src={user && (user.profilePic || "/images/defaultThumbnail.jpeg")}
          alt="Profile Picture"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <ProfileName user={user} />
      <div className="flex flex-wrap gap-2 mt-[2vh] justify-center">
              {(user && user.techStacks && user.techStacks.length!==0) ? user.techStacks.map((techStack, index) => (
              <span className=" border rounded-lg px-2 bg-white shadow-sm" key={index}>{techStack.name}</span>
              ))
              :
              <span className=" border rounded-lg px-2 bg-white shadow-sm">NONE</span>}     
      </div>
      <div className="mt-[1rem] button flex items-center justify-center bg-[#0016DA] text-[white] font-medium w-[15vw] p-[10px] border-none rounded-full cursor-pointer"
            onClick={() => props.setIsEdit(true)}>
        <span>Edit Profile</span>
      </div>
    </div>
  );
};

export default ProfileCard;
