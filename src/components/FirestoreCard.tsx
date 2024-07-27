import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Collapse, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Stack } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { getDocuments, getDocument, addDocument } from '../firebase/firestoreService';
import ReactJson from 'react-json-view';

const collections = ['aboutMe', 'generic', 'posts', 'projects', 'userSubmissions'];

const FirestoreCard = () => {
  const [openCollections, setOpenCollections] = useState<{ [key: string]: boolean }>({});
  const [documents, setDocuments] = useState<{ [key: string]: { id: string; data: any }[] }>({});
  const [selectedDocument, setSelectedDocument] = useState<{ id: string; data: any } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPostData, setNewPostData] = useState<{ [key: string]: any }>({});

  const toggleCollection = async (collectionName: string) => {
    setOpenCollections(prevState => ({
      ...prevState,
      [collectionName]: !prevState[collectionName]
    }));

    if (!documents[collectionName]) {
      const docs = await getDocuments(collectionName);
      setDocuments(prevState => ({
        ...prevState,
        [collectionName]: docs
      }));
    }
  };

  const handleDocumentClick = async (collectionName: string, documentId: string) => {
    const doc = await getDocument(collectionName, documentId);
    setSelectedDocument(doc);
  };

  const handleAddPostClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewPostData({});
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPostData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = async () => {
    await addDocument('posts', newPostData);
    setOpenDialog(false);
    setNewPostData({});
    fetchDocuments('posts'); // Refresh the posts collection
  };

  const fetchDocuments = async (collectionName: string) => {
    const docs = await getDocuments(collectionName);
    setDocuments(prevState => ({
      ...prevState,
      [collectionName]: docs
    }));
  };

  return (
    <Card sx={{ display: 'flex', height: '100%', width: '100%' }}>
      <Box sx={{ width: '30%', borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
        <Stack direction="row" spacing={2} padding={2}>
          <Button variant="contained" onClick={handleAddPostClick}>
            Add Post
          </Button>
        </Stack>
        <List>
          {collections.map((collection) => (
            <React.Fragment key={collection}>
              <ListItem button onClick={() => toggleCollection(collection)}>
                <ListItemText primary={collection} />
                {openCollections[collection] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openCollections[collection]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {documents[collection] && documents[collection].map((doc) => (
                    <ListItem key={doc.id} button onClick={() => handleDocumentClick(collection, doc.id)} sx={{ pl: 4 }}>
                      <ListItemText primary={doc.id} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '70%', padding: 2, overflowY: 'auto' }}>
        <CardContent sx={{ height: '100%' }}>
          {selectedDocument ? (
            <>
              <Typography variant="h5">Document: {selectedDocument.id}</Typography>
              <ReactJson src={selectedDocument.data} />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select a document to see its details.
            </Typography>
          )}
        </CardContent>
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the data for the new post.
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
            label="Content"
            name="content"
            fullWidth
            multiline
            rows={4}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FirestoreCard;
