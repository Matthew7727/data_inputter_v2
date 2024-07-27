// src/components/FirestoreCard.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { getDocuments, getDocument } from '../firebase/firestoreService';
import ReactJson from 'react-json-view';

const collections = ['aboutMe', 'generic', 'posts', 'projects', 'userSubmissions'];

const FirestoreCard = () => {
  const [openCollections, setOpenCollections] = useState<{ [key: string]: boolean }>({});
  const [documents, setDocuments] = useState<{ [key: string]: { id: string; data: any }[] }>({});
  const [selectedDocument, setSelectedDocument] = useState<{ id: string; data: any } | null>(null);

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

  return (
    <Card sx={{ display: 'flex', height: '100%', width: '100%' }}>
      <Box sx={{ width: '30%', borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
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
    </Card>
  );
};

export default FirestoreCard;