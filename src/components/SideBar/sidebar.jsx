import React from 'react';
import { List, ListItem, ListItemText, Drawer, Box, Typography } from '@mui/material';

const Sidebar = ({ leftOptions = [], rightOptions = [], onItemClick }) => {
  const handleItemClick = (category) => {
    onItemClick(category);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left sidebar */}
      <Drawer variant="permanent" anchor="left" PaperProps={{ style: { width: '250px', backgroundColor: '#f5f5f5' } }}>
        <List>
          {leftOptions.map((option, index) => (
            <ListItem 
              button 
              key={index} 
              onClick={() => handleItemClick(option.name)} 
              style={{ borderBottom: '1px solid #E0E0E0' }}
            >
              <ListItemText primary={option.name} style={{ fontWeight: 'bold' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Right sidebar */}
      <Drawer variant="permanent" anchor="right" PaperProps={{ style: { width: '250px', backgroundColor: '#f5f5f5' } }}>
        <Box style={{ padding: '20px', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          <List>
            {rightOptions.map((option, index) => (
              <ListItem 
                button 
                key={index} 
                onClick={() => handleItemClick(option.name)} 
                style={{ borderBottom: '1px solid #E0E0E0' }}
              >
                <ListItemText primary={option.name} style={{ fontWeight: 'bold' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;
