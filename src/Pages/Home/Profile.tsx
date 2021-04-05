import {Card,CardHeader,CardContent,IconButton,Button,CardActions,Typography} from "@material-ui/core";
import {  makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from "react-router";
import { userInfo } from "../../Interface/User";

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
					<CardHeader title={props.userObj?.first_name + "님의"} component="span"/>
					<Typography className={classes.headerContent}>매일이 행복한 투자 현황</Typography>
					<CardContent>
	{/* 회원 정보 수정 */}	<IconButton onClick={onClickSetting}><SettingsIcon className={classes.setting} /></IconButton>
		{/* 로그아웃 */}	<IconButton onClick={props.handleLogOut}><ExitToAppIcon className={classes.logout} /></IconButton>
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

