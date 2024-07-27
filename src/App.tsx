import React from 'react';
import { Container, Tabs, Tab, Box, Button } from '@mui/material';
import FirestoreCard from './components/FirestoreCard';
import StorageCard from './components/StorageCard';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100%', width: '100%' }}
    >
      {value === index && (
        <Box sx={{ height: '100%', width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AuthenticatedApp: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const { logout } = useAuth();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
      <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Firestore" />
          <Tab label="Database" />
        </Tabs>
        <Button onClick={logout} sx={{ marginLeft: 'auto' }}>Log Out</Button>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <TabPanel value={value} index={0}>
          <FirestoreCard />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <StorageCard />
        </TabPanel>
      </Box>
    </Container>
  );
};

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {currentUser ? <AuthenticatedApp /> : <Login />}
    </Box>
  );
};

const RootApp: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default RootApp;