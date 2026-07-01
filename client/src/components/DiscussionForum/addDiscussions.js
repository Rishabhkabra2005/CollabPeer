import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Autocomplete, Chip } from '@mui/material';
import { getTechStacks } from '../../fetch/techStacks';
import axios from 'axios';
import { api } from '../../utils/APIRoutes';
import { postDiscussion } from '../../fetch/discussions';

function AddProject(props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleAddProject = () => {
    const config = {
      withCredentials: true // Add withCredentials option
    };

    let formData = {
      title: title,
      content: content, 
      poster: localStorage.getItem('user')
    }
    props.setIsAddDiscussion(false);
    axios.post(`${api}/discussion/`, formData, config)
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
        <Typography variant="h4" gutterBottom>Discuss</Typography>
        <TextField
          label="Title *"
          variant="outlined"
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Content *"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <div className="flex gap-2 justify-between mt-4">
          <Button variant="contained" onClick={handleAddProject} className=' disabled:bg-blue-200 bg-[#0016DA]'
          disabled={title===""||content===""}>Add</Button>
          <Button variant="contained"  onClick={() => props.setIsAddDiscussion(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
        </div>
      </Box>
    </Container>
  );
}

export default AddProject;
