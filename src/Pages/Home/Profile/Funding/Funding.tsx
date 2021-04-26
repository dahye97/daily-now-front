/** @format */

import { Typography,TableContainer,Table,TableHead, TableRow, TableCell,Paper,TableBody,TableFooter,TablePagination } from "@material-ui/core";
import { makeStyles,   } from "@material-ui/core/styles";

// TODO: 투자 내역 
function createData( product:string,  price:string, fat:string, carbs:string, protein:number) {
	return {  product, price , fat, carbs, protein };
}

const rows = [
	createData('선정산 금융서비스', '1,390,000', '300,000', "100,000", 50),
	createData('경기도 용인시 힐스테이트서천', '200,000,000', '200,000', "100,000", 44),
	createData('양평 서종 타운하우스', '300,000,000', '150,000', "100,000", 15),
];

const useStyles = makeStyles({
	funding: {
		marginTop: "10px",
		fontWeight: "bold",
		padding: "30px"

	},
	totalFunding: {
		
	},
	detailFunding: {

	},
	table: {
		minWidth: 650,
	},
	tableContainer: {
		   marginTop: "10px"
	},
	totalInvestment : {
		fontSize: "15px",
		padding: "16px",
	},
	tableFooter: {
		display: "flex",
		justifyContent : "flex-end",
	}
	}
);

export default function Funding(props: {company: string}) {
	const classes = useStyles()
		return (
			<>
			<Typography variant="h5">📟 내 투자 관리</Typography>
				<div className={classes.funding}>
					{props.company === "all" 
					? 
						<div className={classes.totalFunding}>
							<Typography variant="h6">모든 투자 내역</Typography>
							<p>누적 투자액, 투자 상품 개수, 연결된 p2p 업체 개수, 총 예치금</p>
						</div>
					:
						<div className={classes.detailFunding}>
							<Typography variant="h6">
								<b>{props.company}</b> 상세 투자 내역</Typography>
							<TableContainer className={classes.tableContainer}component={Paper}>
								<Table className={classes.table} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell align="left">투자상품</TableCell>
											<TableCell align="right">상품금액</TableCell>
											<TableCell align="right">투자금액</TableCell>
											<TableCell align="right">예치금</TableCell>
											<TableCell align="right">이자상환일</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row,index) => (
										<TableRow key={index}>
											<TableCell align="left">{row.product}</TableCell>
											<TableCell align="right">{row.price}</TableCell>
											<TableCell align="right">{row.fat}</TableCell>
											<TableCell align="right">{row.carbs}</TableCell>
											<TableCell align="right">{row.protein}일</TableCell>
										</TableRow>
										))}
									</TableBody>

									<TableFooter>
										<div className={classes.tableFooter}>
										<TableCell align="left" className={classes.totalInvestment}>현재 누적 투자액</TableCell>
										<TableCell align="right" className={classes.totalInvestment}>💲 600, 000 원</TableCell>
										</div>
									</TableFooter>
								</Table>
							</TableContainer>
						</div>
					}
				</div>
			</>
		);
}
