import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Autocomplete, Chip } from '@mui/material';
import { getTechStacks } from '../../fetch/techStacks';
import axios from 'axios';
import { api } from '../../utils/APIRoutes';

function EditProfile(props) {
  const [caption, setCaption] = useState('');
  const [techStacks, setTechStacks] = useState([]);
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

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
    formData.append('description', caption);
    for (let i = 0; i < selectedTechStacks.length; i++) {
      formData.append('techStacks', selectedTechStacks[i].id);
    }
      formData.append('avatar', selectedFile[0]);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true // Add withCredentials option
    };    

    props.setIsEdit(false);

    axios.put(`${api}/profile/`, formData, config)
    .then(response => {
      // Handle the response from the server
      console.log(response.data);
    })
    .catch(error => {
      // Handle any errors
      console.error(error);
    });

  };

  return (
    <Container component={Paper} maxWidth="sm">
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Edit Profile</Typography>
        <TextField
            label={"Bio *"}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
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
        <input type="file" accept='.png,.jpg' className="pt-4" onChange={handleFileChange} />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" className=' disabled:bg-[#0016DA] bg-[#0016DA]' onClick={handleAddCourse} 
          disabled={caption==="" || selectedTechStacks.length ===0}>Add</Button>
          <Button variant="contained"  onClick={() => props.setIsEdit(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default EditProfile;
