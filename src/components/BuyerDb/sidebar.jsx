// Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemText, Drawer } from '@mui/material';

const Sidebar = ({ leftOptions = [], rightOptions = [], onItemClick }) => {
  const handleItemClick = (category) => {
    onItemClick(category);
  };

  return (
    <div>
      {/* Left sidebar */}
      <Drawer variant="permanent" anchor="left" style={{ width: '250px' }}>
        <List>
          {leftOptions.map((option, index) => (
            <ListItem button key={index} onClick={() => handleItemClick(option.name)} style={{ borderBottom: '1px solid #FFFFFF', fontWeight: 'bold' }}>
              <ListItemText primary={option.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Right sidebar */}
      <Drawer variant="permanent" anchor="right" style={{ width: '50px' }}>
        <List>
          {rightOptions.map((option, index) => (
            <ListItem button key={index} onClick={() => handleItemClick(option.name)} style={{ borderBottom: '1px solid #FFFFFF', fontWeight: 'bold' }}>
              <ListItemText primary={option.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
