import React from 'react';
import Topbar from '../components/Navbar/Topbar';
import HeaderCard from '../components/CourseView/HeaderCard';
import CommentCard from '../components/CourseView/CommentCard';
import { useEffect, useRef, useState } from 'react';
import { getCourseReview,postComment,toggleEnroll } from '../fetch/courseReview';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import Loader from '../components/Loader';

function CourseView() {
    const [course, setCourse] = useState({});
    const [comment,setComment] = useState('');
    const [isAddComment, setIsAddComment] = useState(false);
    const [enrolled, setEnrolled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("id");
    getCourseReview(encodedData)
      .then((response) => {
        console.log(response);
        setCourse(response.data);
        console.log(
          response.data.enrolledStudents.includes(localStorage.getItem("user"))
        );
        setEnrolled(
          response.data.enrolledStudents.includes(localStorage.getItem("user"))
        );
      })
      .catch((error) => {
        console.error("Error fetching Course:", error);
      });
  }, []);

    const handleAddComment = () => {
      setIsLoading(true);
      postComment(course._id, comment).then((res) => {
        if (res.data.message) {
          alert(res.data.message);
          setIsLoading(false);
          return;
        }
        console.log('Comment Posted:  ', res);
        window.location.reload();
      });
    };

  const handleEnroll = () => {
    toggleEnroll(course._id).then((res) => {
      console.log("Enrolled:", res);
      setEnrolled(!enrolled);
      setCourse({ ...course, enrolledStudents: res.data.enrolledStudents });
    });
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center mb-[10vh]">
      {isLoading && <Loader /> }
      <div className="fixed top-0 left-0 right-0 z-50">
        <Topbar title="Course Review" isSearchDisabled={true} />
      </div>
      <HeaderCard project={course} enrolled={enrolled} />
      <div className="flex flex-col gap-2 w-[80vw] mt-[20vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">
          Description
        </div>
        <div className="">
          <div className="text-[#000000] text-[1rem] mt-2">
            {course && course.description}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-[80vw] mt-[20vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">Enrollment</div>
        <div className="flex gap-2 items-center">
          <div>Are you enrolled in this course?</div>
          {enrolled ? (
            <Button
              variant="contained"
              style={{ backgroundColor: "#0016DA" }}
              onClick={handleEnroll}
            >
              No
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ backgroundColor: "#0016DA" }}
              onClick={handleEnroll}
            >
              Yes
            </Button>
          )}
        </div>
      </div>
      {course && course.coursePic ? (
        <div className="flex flex-col gap-2 w-[80vw] mt-[10vh] pl-[2vw]">
          <div className="text-[1.5rem] text-[#0016DA] font-bold">
            Course Picture
          </div>
          <div className="flex justify-center w-fit">
            <img src={course.coursePic} className="slider-image" />
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-2 w-[80vw] mt-[10vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">
          Tech Stacks
        </div>
        <div>
          <div>
            {course && course.techStacks && course.techStacks.length !== 0 ? (
              course.techStacks.map((techStack, index) => (
                <span
                  className="inline-block mr-8 border rounded-lg px-2 bg-white shadow-sm"
                  key={index}
                >
                  {techStack.name}
                </span>
              ))
            ) : (
              <span className="inline-block mr-8 border rounded-lg px-2 bg-white shadow-sm">
                NONE
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-[80vw] mt-[10vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">Comments</div>
        <div className="flex flex-col gap-2 w-[80vw] mt-[1vh] pl-[2vw]">
          <div
            className="text-[1rem] font-bold mb-[3vh]"
            onClick={() => setIsAddComment(!isAddComment)}
          >
            Add Comment {isAddComment ? "▲" : "▼"}
          </div>
          <div
            className={`flex flex-col ml-[2vw] ${
              isAddComment ? "block" : "hidden"
            }`}
          >
            <TextField
              label="Add comment here"
              variant="outlined"
              className="w-[70vw]"
              multiline
              rows={4}
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              className='enabled:bg-[#0016DA] bg-[#0016DA]'
              disabled={comment===""}              
              onClick={handleAddComment}
              style={{width: "70vw  " }}
            >
              Submit
            </Button>
          </div>
        </div>
        <div>
          {course && course.commentsId && course.commentsId.length !== 0 ? (
            course.commentsId.map((comment, index) => (
              <CommentCard key={index} comments={comment} />
            ))
          ) : (
            <div className="text-[#000000] text-[1rem] mt-2">
              No comments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseView;
