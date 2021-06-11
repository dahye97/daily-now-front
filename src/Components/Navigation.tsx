/** @format */

import { useTheme, createStyles, AppBar, makeStyles, Toolbar,Theme ,
	Divider,List ,ListItem ,ListItemIcon,ListItemText,Collapse,
	Hidden, Drawer,MenuItem, Menu, Fade, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import logo from "../asset/img/logo_white.png";
import { useState,useEffect } from "react";
import PermIdentityTwoToneIcon from '@material-ui/icons/PermIdentityTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import ForumTwoToneIcon from '@material-ui/icons/ForumTwoTone';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

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
		mypageButton: {
			color: "#ffffff",
			marginRight: '10px',
			padding: 0,
			fontSize:'16px',
			fontFamily:'Noto Sans KR'
		},
		menuList: {
			display: "flex",
    			alignItems: "center",
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
		nested: {
			paddingLeft: theme.spacing(4),
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
	isLoggedIn: boolean,
	isAdmin: boolean,
	handleLogOut: () => void,
}
export default function Navigation(props: NavProps) {
	const classes = useStyles();
	const history = useHistory()
	const { handleLogOut,isAdmin } = props;
	const theme = useTheme();

	const [mobileOpen, setMobileOpen] = useState(false);
	const handleDrawerToggle = () => {
	  setMobileOpen(!mobileOpen);
	};

	const menuList = [
		{ name: '커뮤니티', url: '/board?category=0&page=1'},
		{ name: 'FAQ', url: '/faq'},
		{ id: '0', name: '마이페이지'}, // 0 : 로그인한 유저
		{ id: '0', name: '로그아웃'},

		{ id: '1', name: '로그인', url: '/auth'}, // 1 : 비로그인 유저
		{ id: '1', name: '회원가입', url: '/registration?share=FALSE'},
	]

	const myPageMenu = [
		{ id: '0', name: '마이페이지', url: '/home?tabName=MY_FUNDING'}, // 0: 사용자
		{ id: '0', name: '내정보수정', url: '/mypage'},
		{ access: "admin", id: '1', name: '관리자', url: '/admin'}, // 1 : 관리자 
	]
	const iconList = [
		<ForumTwoToneIcon/>,
		<HelpOutlineIcon/>,
		<AccountCircleTwoToneIcon/>,
		<PermIdentityTwoToneIcon />,
		<LockTwoToneIcon/>,
		<ExitToAppIcon/>,
	]
	const myPageIconList = [
		<AccountCircleTwoToneIcon/>,
		<SettingsIcon />,
		<SupervisorAccountIcon />
	]

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
   
	const handleClick = (url?: string|undefined) => {
	  if( url ) history.push(url) 
	  else handleLogOut()
	  
	  if(anchorEl) handleClose()
	  if(mobilmyPageOpen) handleDrawerToggle()
	};
   
	const handleClose = () => {
	  setAnchorEl(null);
	};

	const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
		if(event){
			setAnchorEl(event.currentTarget);
		}
	}

	const [mobilmyPageOpen, setMobileMyPageOpen] = useState(false);
	const handleMobileMyPage = () => {
		setMobileMyPageOpen(!mobilmyPageOpen);
	};

	const drawer = (
	  <div>
	    <div className={classes.toolbar} />
		<Divider />
			<List>
				{menuList.map((menu, index) => {
					let link;
					// 메뉴가 마이페이지 일 경우 드롭다운 형태 
					if(menu.name === "마이페이지") {
						link = (
							<div key={index}>
							<ListItem button onClick={handleMobileMyPage}>
								<ListItemIcon>{iconList[index]}</ListItemIcon>
								<ListItemText primary="마이페이지" />
								{mobilmyPageOpen ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
							<Collapse in={mobilmyPageOpen} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									{myPageMenu.map( (myPage,index) => {
										let listItem = (
											<ListItem 
												button
												className={classes.nested}
												aria-controls="fade-menu" 
												aria-haspopup="true"
												key={index} 
												onClick={() => handleClick(myPage.url)}
											>
												<ListItemIcon>{myPageIconList[index]}</ListItemIcon>
												<ListItemText primary={myPage.name} />
											</ListItem>
										)

										if( myPage.access === "admin" ) { // 관리자 권한 메뉴
											if(isAdmin) {
												return listItem
											}
										}else { // 사용자 권한 메뉴
											return listItem
										}
									})}
						
								</List>
							</Collapse>
						</div>
						)
					}
					
					else {
						link =(
						<ListItem button 
							aria-controls="fade-menu" 
							aria-haspopup="true"
							key={index} 
							onClick={() => handleClick(menu.url)}
						>
							<ListItemIcon>{iconList[index]}</ListItemIcon>
							<ListItemText primary={menu.name} />
						</ListItem>
					)
					}
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
	const container = window !== undefined ? () => window.document.body : undefined;
	if( window.location.href === "/admin") return null;
	else {
		return (
			<header>
				<AppBar position="fixed" className={classes.appbar}>
					<Toolbar className={classes.toolbar}>
						<div style={{display:'flex',alignItems: "center"}}>
							<Link to="/">
								<span style={{display:'flex', alignContent:'center'}}>
									<img src={logo} alt="데일리나우와 함께해요!" className={classes.logo} />
								</span>
							</Link>
						</div>
						<div className={classes.menuList}>
							{ menuList.map( (menu,index) => {
								let link;
								if( menu.name !== "마이페이지") {
									link = 
										<Link 
											key={index} 
											{...menu.url? { to: menu.url} : { onClick: handleLogOut, to: "/"}}
										>{menu.name}
										</Link>
								} else {
									link = 
									<IconButton
										key={index} 
										onClick={handleMouseOver}
										className={classes.mypageButton}
									>
									{menu.name}
									{anchorEl ? <ExpandLess /> : <ExpandMore />}
									</IconButton>
								}

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
						{/* 마이페이지 드롭다운 */}
						<Menu
							id="fade-menu"
							anchorEl={anchorEl}
							keepMounted
							open={open}
							onClose={handleClose}
							TransitionComponent={Fade}
							>
								{
									myPageMenu.map( (myMenu,index) => {
										let menuItem = (
											<MenuItem key={index} onClick={() => handleClick(myMenu.url)}>{myMenu.name}</MenuItem>
										)
										if( myMenu.access === "admin" ) { // 관리자 권한 메뉴
											if(isAdmin) {
												return menuItem
											}
										}else { // 사용자 권한 메뉴
											return menuItem
										}
									})
								}
							
						</Menu>
						<IconButton onClick={handleDrawerToggle} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
							<MenuIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				
				{/* 모바일 메뉴 */}
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
}
