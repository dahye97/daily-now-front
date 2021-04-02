/** @format */

import HomeIcon from "@material-ui/icons/Home";
import { IconButton, Avatar } from "@material-ui/core";
import dailyfunding from "../../asset/img/dailyfunding.png"
import naver from "../../asset/img/naver.png";
import terafunding from "../../asset/img/terafunding.webp";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';

// TODO: 투자 P2P 회사 리스트 
const useStyles = makeStyles({
	fundList: {
		margin: "10px 0",
		padding: "10px 0",
		borderBottom: "1px solid #e0e0e0",
	},
	iconBody: {
		fontSize: "12px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},

});

export default function FundList() {
	const classes = useStyles()
		return (
			<div className={classes.fundList}>
					<IconButton>
						<span className={classes.iconBody}>
							<HomeIcon fontSize="large" />
							<p>나의 투자</p>
						</span>
					</IconButton>

					<IconButton>
						<span className={classes.iconBody}>
							<Avatar src={dailyfunding} />
							<p>Daily Funding</p>
						</span>
					</IconButton>
					<IconButton>
						<span className={classes.iconBody}>
							<Avatar src={naver} />
							<p>Naver Funding</p>
						</span>
					</IconButton>
					<IconButton>
						<span className={classes.iconBody}>
							<Avatar src={terafunding} />
							<p>Tera Funding</p>
						</span>
					</IconButton>
					<IconButton>
						<AddIcon style={{fontSize: "40px"}}/>
					</IconButton>
				
			</div>
		);
}
