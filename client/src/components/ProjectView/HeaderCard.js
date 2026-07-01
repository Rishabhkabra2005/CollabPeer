import React, { useEffect, useState, useRef } from "react";
import { fetchProfileFromServer } from "../../fetch/profile";
import { putLike, putDislike } from "../../fetch/projects";
import { Link } from "react-router-dom";

const HeaderCard = (props) => {

  const [poster, setPoster] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(
    (props.project.likes && props.project.likes.length) || 0
  );
  const [downvotes, setDownvotes] = useState(
    (props.project.dislikes && props.project.dislikes.length) || 0
  );

  useEffect(() => {
    fetchProfileFromServer(localStorage.getItem("user"))
      .then((res) => {
        console.log("PROPS: ", props);
        setCurrentUser(res);
        if (props.project.likes) {
          console.log(props.project.likes);
          setUpvotes(props.project.likes.length);
          if (props.project.likes.includes(res._id)) {
            console.log("upvoted");
            setUpvoted(true);
          } else {
            console.log("not upvoted");
            setUpvoted(false);
          }
        }
        if (props.project.dislikes) {
          console.log(props.project.dislikes);
          setDownvotes(props.project.dislikes.length);
          if (props.project.dislikes.includes(res._id)) {
            console.log("downvoted");
            setDownvoted(true);
          } else {
            console.log("not downvoted");
            setDownvoted(false);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.project]);

  console.log("Project:", props.project);
  useEffect(() => {
    if (!props.project) return;
    if (!props.project.creatorId) return;
    else if (props.project.creatorId.length === 0) return;
    fetchProfileFromServer(props.project.creatorId[0])
      .then((response) => {
        setPoster(response);
        console.log("Poster:", response);
      })
      .catch((error) => {
        console.error("Error fetching poster:", error);
      });
  }, [props.project.creatorId]);

  const formattedDate = new Date(props.project.timeOfPost).toLocaleDateString(
    "en-UK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const handleLike = () => {
    putLike(props.project._id)
      .then((response) => {
        console.log("Like:", response);
        if (downvoted) setDownvoted(!downvoted);
        setUpvoted(!upvoted);
        setUpvotes(response.data.likes.length);
        setDownvotes(response.data.dislikes.length);
      })
      .catch((error) => {
        console.error("Error liking:", error);
      });
  };

  const handleDislike = () => {
    console.log("Dislike:", props.project._id);
    putDislike(props.project._id)
      .then((response) => {
        console.log("Dislike:", response);
        if (upvoted) setUpvoted(!upvoted);
        setDownvoted(!downvoted);
        setUpvotes(response.data.likes.length);
        setDownvotes(response.data.dislikes.length);
      })
      .catch((error) => {
        console.error("Error disliking:", error);
      });
  };


  return (
    <div className="mt-[16vh] flex flex-col w-[80vw] bg-white">
      <div
        className="relative bg-[#FFFFFF] w-[80vw] z-10 flex flex-col mx-auto px-[5vw] rounded-l-xl rounded-t-xl"
        style={{ boxShadow: "0px 0px 15px 0px #CCCCCC" }}
      >
        <img
          src="images/dots1.svg"
          className="absolute top-0 left-0 w-[25vw]"
          alt="dots"
        />
        <img
          src="images/dots2.svg"
          className="absolute bottom-0 right-0 w-[45.8vw] "
          alt="dots"
        />
        <img
          src="images/stars.svg"
          className="absolute ml-[5vw] bottom-0 left-0 w-[10vw] h-[10vh]"
          alt="stars"
        />
        <div className="pt-[9vh] pb-[15vh]">
          <div className="w-full flex justify-end">
            <div className="flex text-[0.875rem] gap-1 items-center">
              <img
                src="./images/starFilled.svg"
                alt="Description"
                className="object-cover object-center w-[1.375rem] h-[1.375rem]"
              />
              {props.project.rating && props.project.rating.toFixed(1)}
            </div>
          </div>
          <div className="flex gap-2">
            <div>{formattedDate}</div>.
            <div className="z-20">
              {props.project.githubLink && (
                <a
                  href={
                    props.project.githubLink.startsWith("http")
                      ? props.project.githubLink
                      : `https://${props.project.githubLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0016DA]"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
          <div className="text-[3rem] font-bold">{props.project.title}</div>
          <div className="flex mt-[3vh] gap-3">
            {props.project.creatorId && props.project.creatorId.length > 0 ? (
              props.project.creatorId.map((user, index) => {
                user.profilePic =
                  user.profilePic || "images/defaultThumbnail.jpeg";
                return (
                    <Link to={`/profile/${user._id}`} className="flex items-center gap-2">
                    <div className="md:max-w-[60px] md:max-h-[60px] md:w-[4vw] md:h-[4vw] md:min-w-[32px] shadow md:min-h-[32px] h-[45px] w-[45px] rounded-full relative overflow-hidden">
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="md:max-w-[60px] md:max-h-[60px] md:w-[4vw] md:h-[4vw] md:min-w-[32px] md:min-h-[32px] h-[45px] w-[45px]"
                      />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div>..</div>
            )}
            {props.project.creatorId && props.project.creatorId.filter((creator) => creator._id === currentUser._id ).length > 0 && <div className="relative">
              <img
                src="images/addCollab.svg"
                alt="add collab"
                className={` hover:cursor-pointer md:max-w-[60px] md:max-h-[60px] md:w-[4vw] md:h-[4vw] md:min-w-[32px] md:min-h-[32px]  rounded-full h-[45px] w-[45px]`}
                onClick={() => props.setIsAddCollab(true)}
              />
            </div>}
          </div>
        </div>
      </div>
      <div
        className="relative ml-auto bg-[#FFFFFF] w-[30vw] h-[2.5rem] flex gap-8 px-[5vw] overflow-hidden rounded-b-xl"
        style={{ boxShadow: "0px 0px 15px 0px #CCCCCC" }}
      >
        <div className="flex justify-center items-center gap-1">
          <img
            src="images/view.svg"
            className="w-[2rem] h-[2rem]"
            alt="Project"
          />
          <div className="text-[1rem]">{props.project.views || 0}</div>
        </div>
        <div className="flex justify-center items-center gap-1">
          <img
            src={`images/${upvoted ? "upvote" : "emptyUpvote"}.svg`}
            className="w-[1.5rem] h-[1.5rem]"
            alt="star"
            onClick={handleLike}
          />
          <div className="text-[1rem]">{upvotes}</div>
        </div>
        <div className="flex justify-center items-center gap-1">
          <img
            src={`images/${downvoted ? "downvote" : "emptyDownvote"}.svg`}
            className={`${
              downvoted ? "w-[2rem] h-[2rem]}" : "w-[2.4rem] h-[2.4rem]"
            }`}
            alt="star"
            onClick={handleDislike}
          />
          <div className="text-[1rem]">{downvotes}</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
