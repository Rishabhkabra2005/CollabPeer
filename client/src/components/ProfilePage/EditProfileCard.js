import React, { useState } from "react";
import { TextField, Autocomplete, Chip } from "@mui/material";
import { api } from "../../utils/APIRoutes";

const TechStacks = [
  { id: 1, title: "Dart" },
  { id: 2, title: "Flutter" },
  { id: 3, title: "React" },
  { id: 4, title: "Node.js" },
  { id: 5, title: "JavaScript" },
  { id: 6, title: "TypeScript" },
];

const EditProfileCard = (onClose) => {
  const [name, setName] = React.useState("");
  const [thumb, setThumb] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [review, setReview] = React.useState("");
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);

  const handleTechStacksChange = (event, value) => {
    setSelectedTechStacks(value);
  };

  return (
    <form
      action={`${api}/coursereview`}
      method="post"
      encType="multipart/form-data"
    >
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="max-w-screen-md w-full h-900 rounded-xl bg-gray-100 p-8">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-semibold">Edit Profile</h1>
            {/* <div className="ml-4 bg-[#4942E4] rounded-full w-10 h-10 flex justify-center items-center">
            <span className="text-white text-3xl pb-1">+</span>
          </div> */}
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <div className="flex justify-center items-center text-black h-6 w-6 text-2xl outline-none focus:outline-none ">
                ×
              </div>
            </button>
          </div>
          <div className="mb-6">
            <span>Name: Aditya Lambat</span>
          </div>
          <div className="mb-6">
            <span>Roll No.: 230150002</span>
          </div>
          <div className="mb-6">
            <span>Program: B-Tech</span>
          </div>
          <div className="mb-6">
            <span>Department: Data Science and Artificial Intelligence</span>
          </div>
          <div className="mb-6">
            <textarea
              className="w-full p-2 rounded-md bg-white border border-gray-300 outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows="4"
            />
          </div>
          <Autocomplete
            multiple
            options={TechStacks}
            getOptionLabel={(option) => option.title}
            value={selectedTechStacks}
            onChange={handleTechStacksChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.title} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="TechStacks "
                placeholder="Select TechStacks"
              />
            )}
          />
          <div style={{ paddingBottom: "5px" }}>
            <span className="bold"> Add a Profile Pic</span>
            <div>
              <input type="file" name="thumbnail" />
              <button className="w-40 h-10 bg-[#4942E4] text-white rounded-md text-lg">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfileCard;
