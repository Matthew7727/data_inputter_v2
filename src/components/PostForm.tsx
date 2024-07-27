import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Stack, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface PostFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PostData) => void;
}

interface PostData {
  dateWritten: string;
  imageUrls: string[];
  mainText: string[];
  path: string;
  postType: string;
  subtitle: string;
  title: string;
}

const PostForm: React.FC<PostFormProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PostData>({
    dateWritten: '',
    imageUrls: [''],
    mainText: [''],
    path: '',
    postType: '',
    subtitle: '',
    title: ''
  });

  useEffect(() => {
    const generatePath = (title: string) => title.toLowerCase().replace(/\s+/g, '');
    setFormData(prevData => ({
      ...prevData,
      path: generatePath(prevData.title)
    }));
  }, [formData.title]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData(prevData => ({
      ...prevData,
      postType: event.target.value as string
    }));
  };

  const handleArrayChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: keyof PostData) => {
    const { value } = event.target;
    setFormData(prevData => {
      if (Array.isArray(prevData[field])) {
        const newFieldData = prevData[field].map((item, i) => (i === index ? value : item));
        return {
          ...prevData,
          [field]: newFieldData
        };
      }
      return prevData;
    });
  };

  const handleAddArrayItem = (field: keyof PostData) => {
    setFormData(prevData => {
      if (Array.isArray(prevData[field])) {
        const newFieldData = [...prevData[field], ''];
        return {
          ...prevData,
          [field]: newFieldData
        };
      }
      return prevData;
    });
  };

  const handleRemoveArrayItem = (field: keyof PostData, index: number) => {
    setFormData(prevData => {
      if (Array.isArray(prevData[field])) {
        const newFieldData = prevData[field].filter((_, i) => i !== index);
        return {
          ...prevData,
          [field]: newFieldData
        };
      }
      return prevData;
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the details for the new post.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          name="title"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Subtitle"
          name="subtitle"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Date Written"
          name="dateWritten"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Path"
          name="path"
          fullWidth
          value={formData.path}
          onChange={handleInputChange}
          disabled
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Post Type</InputLabel>
          <Select
            value={formData.postType}
            onChange={handleSelectChange}
            label="Post Type"
          >
            <MenuItem value="blog">Blog</MenuItem>
            <MenuItem value="article">Article</MenuItem>
          </Select>
        </FormControl>
        <Stack spacing={2}>
          {formData.imageUrls.map((url, index) => (
            <Stack key={index} direction="row" spacing={1}>
              <TextField
                margin="dense"
                label={`Image URL ${index + 1}`}
                value={url}
                fullWidth
                onChange={(e) => handleArrayChange(e, index, 'imageUrls')}
              />
              <Button onClick={() => handleRemoveArrayItem('imageUrls', index)}>-</Button>
            </Stack>
          ))}
          <Button onClick={() => handleAddArrayItem('imageUrls')}>Add Image URL</Button>
        </Stack>
        <Stack spacing={2}>
          {formData.mainText.map((text, index) => (
            <Stack key={index} direction="row" spacing={1}>
              <TextField
                margin="dense"
                label={`Paragraph ${index + 1}`}
                value={text}
                fullWidth
                multiline
                rows={2}
                onChange={(e) => handleArrayChange(e, index, 'mainText')}
              />
              <Button onClick={() => handleRemoveArrayItem('mainText', index)}>-</Button>
            </Stack>
          ))}
          <Button onClick={() => handleAddArrayItem('mainText')}>Add Paragraph</Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostForm;
