import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../../types';
import { Box } from '@mui/material';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
    const { user } = useAuth();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: [UserRole.Admin, UserRole.Manager, UserRole.Partner] },
        { text: 'Projects', icon: <AssignmentIcon />, path: '/projects', roles: [UserRole.Admin, UserRole.Manager, UserRole.Partner] },
        { text: 'Organizations', icon: <BusinessIcon />, path: '/organizations', roles: [UserRole.Admin] },
        { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: [UserRole.Admin] },
    ];

    const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {filteredItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                sx={{
                                    '&.active': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                                    },
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
