import {Card,CardHeader,CardMedia,CardContent,IconButton,Button,CardActions,Typography,Badge,Avatar } from "@material-ui/core";
import {  makeStyles,withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import UpdateIcon from '@material-ui/icons/Update';

import { useHistory } from "react-router";
import { userInfo } from "Interface/User";
import {useEffect,useState} from 'react'
import jiyeon from 'asset/img/jiyeon.png'
import holypig from 'asset/img/holypig.png'
// TODO: 프로필 
const useStyles = makeStyles({
	card: {
		background: "linear-gradient(145deg, #177de2, #1b95ff)",
		color: "white",
		borderRadius: "20px",
		position: 'relative'
	},
	profileHoly: {
		position: 'absolute',
		right: "5%",
		bottom: 0
	},
	headerContent: {
		padding: "0 16px"
	},
	button: {
		color: "#e0e0e0",
		"&:hover": {
			color: "white",
		},
	},
	controlButton: {
		color: "white",
		fontSize: "40px"
	},
	addAccount: {
		color: "white"
	}, 
});

const StyledBadge = withStyles((theme) => ({
	badge: {
	  backgroundColor: '#44b700',
	  color: '#44b700',
	  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
	  '&::after': {
	    position: 'absolute',
	    top: 0,
	    left: 0,
	    width: '100%',
	    height: '100%',
	    borderRadius: '50%',
	    animation: '$ripple 1.2s infinite ease-in-out',
	    border: '1px solid currentColor',
	    content: '""',
	  },
	},
	'@keyframes ripple': {
	  '0%': {
	    transform: 'scale(.8)',
	    opacity: 1,
	  },
	  '100%': {
	    transform: 'scale(2.4)',
	    opacity: 0,
	  },
	},
   }))(Badge);

interface ProfileProps {
	userObj : userInfo | null,
	companyID: number,
	myPoint : number

	handleLogOut:() => void,
	getUserDataOfCompany: (refresh: number, id?: number) => void
	updatePoint : () => void
}
export default function Profile(props:ProfileProps) {
	const history = useHistory();
	const classes = useStyles()
	const {handleLogOut,getUserDataOfCompany, myPoint, updatePoint} = props;

	// mypage로 이동 
	const handleClickSetting = () => {
		history.push('/mypage');
	}
	
	const handleClickFunding = () => {
		history.push('/home?tabName=MY_FUNDING')
	}
	// 초대 코드 생성 함수 
	const handleClickShare = () => {
		history.push('/home?tabName=INVITE')
	}

	// 포인트 내역 확인 
	const handleClickPoint = () => {
		history.push('/home?tabName=POINT_TOTAL')
	}

	const handleClickRefresh = () => {
		getUserDataOfCompany(1)
	}

	useEffect(() => {
		updatePoint()
	}, [])

		return (
			<div className="profile">
				<Card className={classes.card} elevation={3}>
					<div style={{display:'flex', 'justifyContent':'space-between'}}>
						<CardHeader 
						title={props.userObj?.first_name + "님의"} 
						component="span"
						avatar={
							<StyledBadge
								overlap="circle"
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								variant="dot"
								>
								<Avatar src={jiyeon}/>
							</StyledBadge>
						}
						></CardHeader>
						<CardMedia>
			{/* 새로고침 */}	<IconButton onClick={handleClickRefresh}><UpdateIcon className={classes.controlButton}/></IconButton>
		{/* 회원 정보 수정 */}	<IconButton onClick={handleClickSetting}><SettingsIcon className={classes.controlButton} /></IconButton>
			{/* 로그아웃 */}	<IconButton onClick={handleLogOut}><ExitToAppIcon className={classes.controlButton} /></IconButton>
						</CardMedia>
					</div>
					<Typography className={classes.headerContent}>매일이 행복한 투자 현황</Typography>
					<CardContent>
						<p>보유 포인트</p>
						<h2>{myPoint ? myPoint : 0} P</h2>
					</CardContent>
					<CardActions>
						<div>
							<Button 
							onClick={handleClickFunding} className={classes.button}>나의투자</Button>
							<Button 
							onClick={handleClickPoint} className={classes.button}>포인트내역</Button>
							<Button 
							onClick={handleClickShare} className={classes.button}>공유하기</Button>
						</div>
						<div>
							<img 
							className={classes.profileHoly}
							src={holypig} width="220px"
							alt="사용자님의 프로필을 확인합니다."/> 
						</div>
					</CardActions>
				</Card>
			</div>
		);
}

