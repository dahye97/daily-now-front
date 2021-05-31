/** @format */

import { useTheme, createStyles, AppBar, makeStyles, Toolbar,Theme ,
	Divider,List ,ListItem ,ListItemIcon,ListItemText,
	Hidden, Drawer} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import logo from "../asset/img/logo_white.png";
import { useState } from "react";
import PermIdentityTwoToneIcon from '@material-ui/icons/PermIdentityTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import ForumTwoToneIcon from '@material-ui/icons/ForumTwoTone';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => 
	createStyles({
		appbar: {
			background: "#198BFB",
			fontFamily: 'Noto Sans KR'
		},
		logo: {
			maxWidth: "185px",
			flexGrow: 1,
		},
		menuButton: {
			[theme.breakpoints.up('sm')]: {
				display: 'none'
			},
		},
		menuList: {
			display: 'block'
		},
		toolbar: {
			display: "flex",
			justifyContent: "space-between",
			
			'& a' : {
				textDecoration : 'none',
				color: "#ffffff",
				marginRight: '10px'
			}
		},
		drawer: {
			[theme.breakpoints.up('sm')]: {
			  width: drawerWidth,
			  flexShrink: 0,
			},
		   },
		drawerPaper: {
		width: drawerWidth,
		},
		'@media(max-width: 600px)' : {
			menuButton: {
				display: 'block',
			},
			menuList: {
				display:'none'
			}
		}
	})
	);
interface NavProps {
	isLoggedIn: boolean;
	handleLogOut: () => void,
	window?: () => Window;
}
export default function Navigation(props: NavProps) {
	const classes = useStyles();
	const history = useHistory()
	const { window, handleLogOut } = props;
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
	  setMobileOpen(!mobileOpen);
	};

	const menuList = [
		{ name: '커뮤니티', url: '/board'},
		{ name: 'FAQ', url: '/faq'},
		{ id: '0', name: '마이페이지', url: '/home?tabName=MY_FUNDING'},
		{ id: '0', name: '로그아웃'},
		{ id: '1', name: '로그인', url: '/auth'},
		{ id: '1', name: '회원가입', url: '/registration?share=FALSE'},
	]

	const iconList = [
		<ForumTwoToneIcon/>,
		<HelpOutlineIcon/>,
		<AccountCircleTwoToneIcon/>,
		<PermIdentityTwoToneIcon />,
		<LockTwoToneIcon/>,
	]
	const drawer = (
	  <div>
	    <div className={classes.toolbar} />
		<Divider />
			<List>
				{menuList.map((menu, index) => {
					const link =(
						<ListItem button 
							key={index} 
							onClick={ menu.url 
							? () => history.push(menu.url) 
							: () => handleLogOut()}
						>
							<ListItemIcon>{iconList[index]}</ListItemIcon>
							<ListItemText primary={menu.name} />
						</ListItem>
					)
					if( menu.id === "0") {
						if( props.isLoggedIn ){
							return link
						}
					}else if ( menu.id === "1"){
						if(!props.isLoggedIn) {
							return link
						}
					} else return link
					})}
			</List>
		<Divider />
	  </div>
	);
	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<header>
			<AppBar position="fixed" className={classes.appbar}>
				<Toolbar className={classes.toolbar}>
					<Link to="/">
						<span style={{display:'flex', alignContent:'center'}}>
							<img src={logo} alt="데일리나우와 함께해요!" className={classes.logo} />
						</span>
					</Link>
					<div className={classes.menuList}>
						{ menuList.map( (menu,index) => {
							const link = <Link 
										key={index} 
										{...menu.url? { to: menu.url} : { onClick: handleLogOut, to: "/"}}
										>{menu.name}
										</Link>
							if( menu.id === "0") {
								if( props.isLoggedIn ){
									return link
								}
							}else if ( menu.id === "1"){
								if(!props.isLoggedIn) {
									return link
								}
							} else return link
						})}
					</div>
					<IconButton onClick={handleDrawerToggle} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="mailbox folders">
				<Hidden smUp implementation="css">
					<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					anchor={theme.direction === 'rtl' ? 'right' : 'left'}
					onClose={handleDrawerToggle}
					classes={{
					paper: classes.drawerPaper,
					}}
					ModalProps={{
					keepMounted: true, 
					}}
					>
					{drawer}
					</Drawer>
				</Hidden>
			</nav>
		</header>
	);
}
