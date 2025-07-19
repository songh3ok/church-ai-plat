import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications
} from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
  showMenuText?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showMenuText = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);

  const menuItems = [
    { path: '/dashboard', icon: <DashboardIcon />, label: '대시보드' },
    { path: '/members', icon: <PeopleIcon />, label: '성도 관리' },
    { path: '/sermons', icon: <BookIcon />, label: '설교 관리' },
    { path: '/analytics', icon: <AnalyticsIcon />, label: '분석 리포트' },
    { path: '/settings', icon: <SettingsIcon />, label: '설정' }
  ];

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : '대시보드';
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* 왼쪽 고정 네비게이션 */}
      <Drawer
        variant="permanent"
        sx={{
          width: showMenuText ? 200 : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: showMenuText ? 200 : 64,
            backgroundColor: '#1a1a1a',
            borderRight: '1px solid #333',
            color: 'white',
            overflowX: 'hidden',
            transition: 'width 0.2s ease-in-out'
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
          {showMenuText ? (
            <>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Herald
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', fontSize: '0.75rem' }}>
                Church AI System
              </Typography>
            </>
          ) : (
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
              H
            </Typography>
          )}
        </Box>
        
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.path}
              component="button"
              onClick={() => navigate(item.path)}
              sx={{ 
                backgroundColor: location.pathname === item.path ? '#333' : 'transparent',
                '&:hover': { backgroundColor: '#333' },
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                minHeight: 48,
                px: showMenuText ? 2 : 1,
                justifyContent: showMenuText ? 'flex-start' : 'center'
              }}
            >
              <ListItemIcon sx={{ 
                color: '#888', 
                minWidth: showMenuText ? 40 : 'auto',
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              {showMenuText && (
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.875rem',
                      color: 'white'
                    } 
                  }} 
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 메인 콘텐츠 영역 */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 상단 헤더 */}
        <AppBar position="static" sx={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
          <Toolbar sx={{ minHeight: 64 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
              {getCurrentPageTitle()}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Toolbar>
          
          {/* 상단 탭 메뉴 (대시보드에서만 표시) */}
          {location.pathname === '/dashboard' && (
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)}
              sx={{ 
                backgroundColor: '#1a1a1a',
                borderBottom: '1px solid #333',
                '& .MuiTab-root': { 
                  color: '#888',
                  fontSize: '0.875rem',
                  minHeight: 48,
                  textTransform: 'none'
                },
                '& .Mui-selected': { color: 'white' },
                '& .MuiTabs-indicator': { backgroundColor: '#1976d2' }
              }}
            >
              <Tab label="Network View" />
              <Tab label="Alerts" />
              <Tab label="Sermons" />
              <Tab label="Analytics" />
              <Tab label="AIP Proposals" />
            </Tabs>
          )}
        </AppBar>

        {/* 페이지 콘텐츠 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 