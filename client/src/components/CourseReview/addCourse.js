import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Autocomplete, Chip } from '@mui/material';
import { getTechStacks } from '../../fetch/techStacks';
import axios from 'axios';
import { api } from '../../utils/APIRoutes';

function AddProject(props) {
  const [courseName, setcourseName] = useState('');
  const [linkToCourse, setLinkToCourse] = useState('');
  const [description, setDescription] = useState('');
  const [techStacks, setTechStacks] = useState([]);
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  console.log(selectedFile[0])
  useEffect(() => {
    getTechStacks().then((res) => {
      const formattedTechStacks = res.data.map((value, index) => (
        { id: value._id , title: value.name }
      ));
      setTechStacks(formattedTechStacks);
    });
  }, []);

  const handleTechStacksChange = (event, value) => {
    setSelectedTechStacks(value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleAddCourse = () => {
    const formData = new FormData();
    formData.append('title', courseName);
    formData.append('courseLink', linkToCourse);
    formData.append('description', description);
    for(let i=0; i<selectedTechStacks.length; i++) {
      formData.append('techStacks', selectedTechStacks[i].id);
    }
    formData.append('thumbnail', selectedFile[0]);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true // Add withCredentials option
    };    

    props.setIsAddCourse(false);

      axios.post(`${api}/coursereview/`, formData, config)
      .then(response => {
        // Handle the response from the server
        console.log(response.data);
        props.setIsAddCourse(false);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  };

  return (
    <Container component={Paper} maxWidth="sm">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Add a Review</Typography>
        <TextField
          label="Course Name *"
          variant="outlined"
          fullWidth
          size="small"
          value={courseName}
          onChange={(e) => setcourseName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Link To Course *"
          variant="outlined"
          fullWidth
          size="small"
          value={linkToCourse}
          onChange={(e) => setLinkToCourse(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Description *"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <Autocomplete
          className='mt-4'
          multiple
          options={techStacks}
          getOptionLabel={(option) => option.title}
          value={selectedTechStacks}
          onChange={handleTechStacksChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option.title} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="TechStacks Used" placeholder="Select TechStacks" size="small" />
          )}
        />
        <input type="file" className="pt-4" onChange={handleFileChange} />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" onClick={handleAddCourse} className=' disabled:bg-blue-200 bg-[#0016DA]'
           disabled={courseName===""||linkToCourse===""||description===""||selectedFile.length===0}>Add</Button>
          <Button variant="contained"  onClick={() => props.setIsAddCourse(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default AddProject;
