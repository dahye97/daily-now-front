import {Card,CardHeader,CardContent,IconButton,Button,CardActions,Typography,Badge,Avatar } from "@material-ui/core";
import {  makeStyles,withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from "react-router";
import { userInfo } from "../../../Interface/User";

// TODO: 프로필 
const useStyles = makeStyles({
	card: {
		background: "linear-gradient(145deg, #177de2, #1b95ff)",
		color: "white",
		borderRadius: "20px",
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
	setting: {
		color: "white",
		fontSize: "40px"
	},
	addAccount: {
		color: "white"
	}, 
	logout: {
		color: 'white',
		fontSize: "40px"
	}
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
	handleLogOut:any,
}
export default function Profile(props:ProfileProps) {
	const history = useHistory();

	const onClickSetting = () => {
		history.push('/mypage');
	}

	const classes = useStyles()
		return (
			<div className="profile">
				<Card className={classes.card} elevation={3}>
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
								<Avatar/>
							</StyledBadge>
						}></CardHeader>

					<Typography className={classes.headerContent}>매일이 행복한 투자 현황</Typography>
					<CardContent>
	{/* 회원 정보 수정 */}	<IconButton onClick={onClickSetting}><SettingsIcon className={classes.setting} /></IconButton>
		{/* 로그아웃 */}	<IconButton onClick={props.handleLogOut}><ExitToAppIcon className={classes.logout} /></IconButton>
					</CardContent>
					<CardActions>
						<Button className={classes.button}>회원정보</Button>
						<Button className={classes.button}>나의투자</Button>
						<Button className={classes.button}>활동</Button>
						<Button className={classes.button}>메세지</Button>
					</CardActions>
				</Card>
			</div>
		);
}

