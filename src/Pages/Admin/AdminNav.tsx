import React,{useState,useEffect} from 'react'
import axios from 'axios';

import { createStyles, makeStyles, Theme,useTheme } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Drawer,CssBaseline ,List,Divider,ListItem,ListItemIcon,ListItemText,Hidden,Typography } from "@material-ui/core";
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import { userInfo } from 'Interface/User';
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => 
	createStyles({
             drawer: {
               [theme.breakpoints.up('sm')]: {
                 width: drawerWidth,
                 flexShrink: 0,
               },
             },
             appBar: {
               [theme.breakpoints.up('sm')]: {
                 width: `calc(100% - ${drawerWidth}px)`,
                 marginLeft: drawerWidth,
               },
             },
             menuButton: {
               marginRight: theme.spacing(2),
               [theme.breakpoints.up('sm')]: {
                 display: 'none',
               },
             },
             // necessary for content to be below app bar
             toolbar: theme.mixins.toolbar,
             drawerPaper: {
               width: drawerWidth,
             },
             content: {
               flexGrow: 1,
               padding: theme.spacing(3),
             },
         
	})
	);
interface Props {
     userObj: userInfo
     window?: () => Window;
}
export default function AdminNav(props: Props) {
     const { window,userObj } = props;
     const classes = useStyles();
     const theme = useTheme();
     const [mobileOpen, setMobileOpen] = React.useState(false);
   
     const handleDrawerToggle = () => {
       setMobileOpen(!mobileOpen);
     };
   
     // 좌측 메뉴 리스트 받아오기 
     const getMenuList = () => {
          axios.get(`${process.env.REACT_APP_SERVER}/api/admin/admin_category`, {
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               console.log(res)
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     useEffect(() => {
          getMenuList()
     }, [])
     const drawer = (
       <div>
         <div className={classes.toolbar} />
         <Divider />
         <List>
           {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
             <ListItem button key={text}>
               <ListItemText primary={text} />
             </ListItem>
           ))}
         </List>
         <Divider />
         <List>
           {['All mail', 'Trash', 'Spam'].map((text, index) => (
             <ListItem button key={text}>
               <ListItemText primary={text} />
             </ListItem>
           ))}
         </List>
       </div>
     );
   
     const container = window !== undefined ? () => window().document.body : undefined;
   
     return (
          <>
          <CssBaseline />
               {/* 관리자 페이지 상단 Bar */}
               <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                         <IconButton
                         color="inherit"
                         aria-label="open drawer"
                         edge="start"
                         onClick={handleDrawerToggle}
                         className={classes.menuButton}
                         >
                         <DnsRoundedIcon />
                         </IconButton>
                         <Typography variant="h6" noWrap>
                         Admin Page
                         </Typography>
                    </Toolbar>
               </AppBar>
               {/* 좌측 Bar */}
               <nav className={classes.drawer} aria-label="mailbox folders">
                    <Hidden smUp implementation="css">
                         <Drawer
                              container={container}
                              variant="temporary"
                              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                              open={mobileOpen}
                              onClose={handleDrawerToggle}
                              classes={{
                              paper: classes.drawerPaper,
                              }}
                              ModalProps={{
                              keepMounted: true, // Better open performance on mobile.
                              }}
                              >
                              {drawer}
                         </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                         <Drawer
                         classes={{
                         paper: classes.drawerPaper,
                         }}
                         variant="permanent"
                         open
                         >
                         {drawer}
                         </Drawer>
                    </Hidden>
               </nav>
          </>
     )
}
