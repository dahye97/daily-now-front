import {Card,CardHeader,CardContent,IconButton,Button,CardActions,Typography} from "@material-ui/core";
import {  makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from "react-router";

// TODO: 프로필 
const useStyles = makeStyles({
	card: {
		background: "#198BFB",
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
		color: "white"
	},
	addAccount: {
		color: "white"
	}, 
	logout: {
		color: 'white'
	}
});

interface ProfileProps {
	clickLogOut:any,
}
export default function Profile(props:ProfileProps) {
	const history = useHistory();

	const clickSetting = () => {
		history.push('/mypage');
	}

	const classes = useStyles()
		return (
			<div className="profile">
				<Card className={classes.card} elevation={3}>
					<CardHeader title="장다혜님의" component="span"/>
					<Typography className={classes.headerContent}>매일이 행복한 투자 현황</Typography>
					<CardContent>
	{/* 회원 정보 수정 */}	<IconButton className={classes.setting} onClick={clickSetting}><SettingsIcon /></IconButton>
		{/* 로그아웃 */}	<IconButton className={classes.logout} onClick={props.clickLogOut}><ExitToAppIcon/></IconButton>
					</CardContent>
					<CardActions>
						<Button className={classes.button}>회원정보</Button>
						<Button className={classes.button}>나의투자</Button>
						<Button className={classes.button}>포인트</Button>
						<Button className={classes.button}>활동</Button>
						<Button className={classes.button}>메세지</Button>
					</CardActions>
				</Card>
			</div>
		);
}

