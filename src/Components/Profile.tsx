import {Card,CardHeader,CardContent,IconButton,Button,CardActions,} from "@material-ui/core";
import {  makeStyles } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from "react-router";

const useStyles = makeStyles({
	card: {
		background: "#198BFB",
		color: "white",
		fontWeight: "bold",
		borderRadius: "20px",
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
		
	}

	const classes = useStyles()
		return (
			<div className="my-page">
				<Card className={classes.card} elevation={3}>
					<CardHeader title="마이페이지" component="span"/>
					<CardContent>
						<IconButton className={classes.addAccount}>
							<AddIcon />
						</IconButton>
						<IconButton className={classes.setting} onClick={clickSetting}>
							<SettingsIcon />
						</IconButton>
						<IconButton className={classes.logout} onClick={props.clickLogOut}>
							<ExitToAppIcon/>
						</IconButton>
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

