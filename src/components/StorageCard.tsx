import React, { useState, useEffect } from 'react';
import fb from '../firebase/firebaseConfig';
import { ref, listAll, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';
import { List, ListItem, ListItemText, IconButton, Box, Typography, Stack, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';


interface StorageItem {
  name: string;
  fullPath: string;
  isFolder: boolean;
}

const StorageTab: React.FC = () => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [path, setPath] = useState<string>(''); // Set initial path to root
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [folderName, setFolderName] = useState<string>('');
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const storageRef = ref(fb.storage, path);
      const res = await listAll(storageRef);

      const folders = res.prefixes.map(prefix => ({
        name: prefix.name,
        fullPath: prefix.fullPath,
        isFolder: true
      }));

      const files = res.items.map(item => ({
        name: item.name,
        fullPath: item.fullPath,
        isFolder: false
      }));

      setItems([...folders, ...files]);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [path]);

  const handleItemClick = (item: StorageItem) => {
    if (item.isFolder) {
      setPath(prevPath => prevPath ? `${prevPath}/${item.name}` : item.name);
    } else {
      getDownloadURL(ref(fb.storage, item.fullPath)).then((url) => {
        window.open(url, '_blank');
      }).catch((error) => {
        console.error('Error getting download URL:', error);
      });
    }
  };

  const handleBackClick = () => {
    setPath(prevPath => prevPath.substring(0, prevPath.lastIndexOf('/')));
  };

  const deleteFolderContents = async (folderRef: any) => {
    const res = await listAll(folderRef);
    const promises = res.items.map((itemRef) => deleteObject(itemRef));
    await Promise.all(promises);
  };

  const handleDeleteClick = async (fullPath: string, isFolder: boolean, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click event from propagating to the ListItem
    try {
      const itemRef = ref(fb.storage, fullPath);
      if (isFolder) {
        await deleteFolderContents(itemRef);
      }
      await deleteObject(itemRef);
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddFolder = () => {
    setOpenFolderDialog(true);
    handleMenuClose();
  };

  const handleAddFile = () => {
    setOpenFileDialog(true);
    handleMenuClose();
  };

  const handleFolderDialogClose = () => {
    setOpenFolderDialog(false);
    setFolderName('');
  };

  const handleFileDialogClose = () => {
    setOpenFileDialog(false);
    setSelectedFile(null);
  };

  const handleFolderSubmit = async () => {
    if (folderName) {
      const newFolderRef = ref(fb.storage, `${path}/${folderName}/placeholder.txt`);
      const placeholderFile = new File(["placeholder"], "placeholder.txt", { type: "text/plain" });
      await uploadBytes(newFolderRef, placeholderFile);
      handleFolderDialogClose();
      fetchItems(); // Refresh the item list
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileSubmit = async () => {
    if (selectedFile) {
      const fileRef = ref(fb.storage, `${path}/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      handleFileDialogClose();
      fetchItems(); // Refresh the item list
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={handleBackClick} disabled={!path}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Current Path: {path || '/'}</Typography>
        <IconButton color="primary" aria-label="add" onClick={handleMenuClick}>
          <AddIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleAddFolder}>Add Folder</MenuItem>
          <MenuItem onClick={handleAddFile}>Add File</MenuItem>
        </Menu>
      </Stack>

      <Dialog open={openFolderDialog} onClose={handleFolderDialogClose}>
        <DialogTitle>Add New Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the new folder.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFolderDialogClose}>Cancel</Button>
          <Button onClick={handleFolderSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFileDialog} onClose={handleFileDialogClose}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a file to upload.
          </DialogContentText>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileDialogClose}>Cancel</Button>
          <Button onClick={handleFileSubmit}>Upload</Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <List>
          {items.map(item => (
            <ListItem button key={item.fullPath} onClick={() => handleItemClick(item)}>
              <ListItemText 
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {item.isFolder ? <FolderIcon /> : <InsertDriveFileIcon />}
                    <Typography>{item.name}</Typography>
                  </Stack>
                }
              />
              <IconButton edge="end" aria-label="delete" onClick={(event) => handleDeleteClick(item.fullPath, item.isFolder, event)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default StorageTab;
