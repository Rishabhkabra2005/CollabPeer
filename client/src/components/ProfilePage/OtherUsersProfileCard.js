import React from "react";
import ProfileName from "./ProfileName";
import { addConnection, removeConnection } from "../../fetch/profile";

const OtherUsersProfileCard = (props) => {
  const user = props.user;
  const [isConnected, setIsConnected] = React.useState();

  React.useEffect(() => {
    console.log("user", user);
    if (user && user.connections) {
      let res = false;
      user.connections.forEach((connection) => {
        console.log("connection", connection , localStorage.getItem("user"));
        if (connection._id === localStorage.getItem("user")) {
          res = true;
        }
      });
      setIsConnected(res);
    }
  }, [props.user]);

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
        {(user && user.techStacks && user.techStacks.length !== 0) ? user.techStacks.map((techStack, index) => (
          <span className=" border rounded-lg px-2 bg-white shadow-sm" key={index}>{techStack.name}</span>
        ))
          :
          <span className=" border rounded-lg px-2 bg-white shadow-sm"></span>}
      </div>
      {isConnected ?
        <div className="mt-[1rem] button flex items-center justify-center text-[#0016DA] font-medium w-[15vw] p-[10px] border-[#0016DA] border-2 rounded-full cursor-pointer"
          onClick={() => { removeConnection(user._id); setIsConnected(false) }}
        >
          <span>Disconnect</span>
        </div>
        :
        <div className="mt-[1rem] button flex items-center justify-center bg-[#0016DA] text-[white] font-medium w-[15vw] p-[10px] border-none rounded-full cursor-pointer"
          onClick={() => { addConnection(user._id); setIsConnected(true) }}
        >
          <span>Connect</span>
        </div>
      }
    </div>
  );
};

export default OtherUsersProfileCard;
