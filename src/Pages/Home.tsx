/** @format */

import Profile from "../Components/Profile";
import FundList from "../Components/FundList";
import FundDetail from "../Components/FundDetail";
import { makeStyles } from "@material-ui/core/styles";

import { Container } from "@material-ui/core";
const useStyles = makeStyles({
	homeContainer: {
		padding: "20px",
		marginTop: "30px",
		borderRadius: "50px",
		background: "#ffffff",
		boxShadow: "17px 17px 34px #b1b1b1, -17px -17px 34px #ffffff",
		overflow: "hidden",
	},
});

interface HomeProps {
	handleLogOut: any,
}
export default function Home(props: HomeProps) {
	const classes = useStyles();
	return (
		<Container className={classes.homeContainer} maxWidth="md">
			<Profile clickLogOut={props.handleLogOut}/>
			<FundList />

			<FundDetail />
		</Container>
	);
}
