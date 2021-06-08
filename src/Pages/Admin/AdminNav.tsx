import React,{useState,useEffect} from 'react'
import axios from 'axios';

import { createStyles, makeStyles, Theme,useTheme } from '@material-ui/core/styles';
import { AppBar, Collapse, Toolbar, IconButton, Drawer,CssBaseline ,List,Divider,ListItem,ListItemIcon,ListItemText,Hidden,Typography } from "@material-ui/core";
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import { userInfo } from 'Interface/User';
import { menuInfo } from 'Interface/Admin';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router';

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
             nested: {
			paddingLeft: theme.spacing(4),
		   },
         
	})
	);
interface Props {
     userObj: userInfo
     window?: () => Window;
}
export default function AdminNav(props: Props) {
     const { window,userObj } = props;
     const history= useHistory()
     const classes = useStyles();
     const theme = useTheme();
     const [menuList, setMenuList] = useState<menuInfo[]>([])
     
     // 좌측 메뉴 바 토글
     const [drawerOpen, setDrawerOpen] = React.useState(false);
     const handleDrawerToggle = () => {
          setDrawerOpen(!drawerOpen);
     };
    
     // 좌측 메뉴 리스트 받아오기 
     const getMenuList = () => {
          axios.get(`${process.env.REACT_APP_SERVER}/api/admin/admin_category`, {
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               console.log(res.data)
               setMenuList(res.data)
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     useEffect(() => {
          getMenuList()
     }, [])

     // 좌측 메뉴 드롭다운 토글
     const [dropDownOpen, setDropDownOpen] = useState('');
	const handleDropDown = (category_id : number) => {
          if(dropDownOpen === ('menu'+category_id)) setDropDownOpen('menu')
		else setDropDownOpen('menu'+category_id); 
	};

     const drawer = (
       <div>
         <div className={classes.toolbar} />
         <Divider />
               <List>
                    {menuList.map((menu, index) => {
                         return (
                              <div key={index}>
                                   <ListItem 
                                        button key={index} 
                                        {...menu.child_category && { onClick: () => handleDropDown(menu.category_id)}}>
                                        <ListItemText primary={menu.category_name} />
                                        {dropDownOpen === ('menu'+menu.category_id) ? <ExpandLess /> : <ExpandMore />}
                                   </ListItem>
                                   { menu.child_category && 
                                        <Collapse in={dropDownOpen === ('menu'+menu.category_id)} timeout="auto" unmountOnExit>
                                             <List component="div" disablePadding>
                                                  {menu.child_category.map( (detail,index) => {
                                                       return (
                                                       <ListItem 
                                                            button 
                                                            key={index} 
                                                            className={classes.nested} 
                                                            onClick={() => {
                                                                 history.push('/admin'+detail.url, {index: index})
                                                            }}
                                                       >
                                                            <ListItemText primary={detail.category_name} />
                                                       </ListItem>)
                                                  })}
                                             </List>
                                        </Collapse>
                                   }
                              </div>
                         )
                    })}
               </List>
         <Divider />
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
                         Admin Now
                         </Typography>
                    </Toolbar>
               </AppBar>
               {/* 좌측 Bar */}
               <nav className={classes.drawer} aria-label="menu folders">
               <Hidden smUp implementation="css">
                    <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={drawerOpen}
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
