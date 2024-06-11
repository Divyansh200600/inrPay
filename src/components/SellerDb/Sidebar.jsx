// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemText, Drawer } from '@mui/material';

const Sidebar = ({ leftOptions = [], rightOptions = [], onItemClick }) => {
  return (
    <div>
      {/* Left sidebar */}
      <Drawer variant="permanent" anchor="left" PaperProps={{ style: { width: '250px' } }}>
        <List>
          {leftOptions.map((option, index) => (
            <ListItem button key={index} onClick={() => onItemClick(option.name)}>
              <ListItemText primary={option.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Right sidebar */}
      <Drawer variant="permanent" anchor="right" PaperProps={{ style: { width: '250px' } }}>
        <List>
          {rightOptions.map((option, index) => (
            <ListItem button key={index} onClick={() => onItemClick(option.name)}>
              <ListItemText primary={option.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
