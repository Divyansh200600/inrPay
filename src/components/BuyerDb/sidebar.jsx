// Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemText, Drawer } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({ leftOptions = [], rightOptions = [] }) => {
  return (
    <div>
      {/* Left sidebar */}
      <Drawer variant="permanent" anchor="left" style={{ width: '250px' }}> {/* Adjust width here */}
        <List>
          {leftOptions.map((option, index) => (
            <ListItem button key={index} component={Link} to={option.path} style={{ borderBottom: '1px solid #FFFFFF', fontWeight: 'bold' }}>
              <ListItemText primary={option.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Right sidebar */}
      <Drawer variant="permanent" anchor="right" style={{ width: '50px' }}> {/* Adjust width here */}
        <List>
          {rightOptions.map((option, index) => (
            <ListItem button key={index} component={Link} to={option.path} style={{ borderBottom: '1px solid #FFFFFF', fontWeight: 'bold' }}>
              <ListItemText primary={option.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
