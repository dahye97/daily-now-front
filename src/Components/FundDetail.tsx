/** @format */

import { Typography,TableContainer,Table,TableHead, TableRow, TableCell,Paper,TableBody } from "@material-ui/core";
import { makeStyles,   } from "@material-ui/core/styles";


function createData(companyName:string, product:string,  price:string, fat:string, carbs:number, protein:number) {
	return { companyName, product, price , fat, carbs, protein };
}

const rows = [
	createData('데일리펀딩','선정산 금융서비스', '1,390,000', '10,000', 24, 50),
	createData('네이버펀딩','경기도 용인시 힐스테이트서천', '200,000,000', '20,000', 37, 44),
	createData('테라펀딩','양평 서종 타운하우스', '300,000,000', '150,000', 24, 15),
];

const useStyles = makeStyles({
	rating: {
		marginTop: "10px",
		padding: "10px",
		fontWeight: "bold",

	},
	table: {
		minWidth: 650,
	   },
	   tableContainer: {
		   marginTop: "10px"
	   }
	}
);

export default function FundDetail() {
	const classes = useStyles()
		return (
			<div className={classes.rating}>
				<Typography variant="h6">투자 상세 내역</Typography>

				<TableContainer className={classes.tableContainer}component={Paper}>
					<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
						<TableCell>기업 이름</TableCell>
						<TableCell align="left">투자상품</TableCell>
						<TableCell align="right">상품금액</TableCell>
						<TableCell align="right">투자금액</TableCell>
						<TableCell align="right">예치금</TableCell>
						<TableCell align="right">이자상환일</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
						<TableRow key={row.companyName}>
						<TableCell component="th" scope="row">
							{row.companyName}
						</TableCell>
						<TableCell align="left">{row.product}</TableCell>
						<TableCell align="right">{row.price}</TableCell>
						<TableCell align="right">{row.fat}</TableCell>
						<TableCell align="right">{row.carbs}</TableCell>
						<TableCell align="right">{row.protein}일</TableCell>
						</TableRow>
						))}
					</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
}
