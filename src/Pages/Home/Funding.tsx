/** @format */

import { Typography,TableContainer,Table,TableHead, TableRow, TableCell,Paper,TableBody } from "@material-ui/core";
import { makeStyles,   } from "@material-ui/core/styles";

// TODO: 투자 내역 
function createData(companyName:string, product:string,  price:string, fat:string, carbs:number, protein:number) {
	return { companyName, product, price , fat, carbs, protein };
}

const rows = [
	createData('데일리펀딩','선정산 금융서비스', '1,390,000', '10,000', 24, 50),
	createData('네이버펀딩','경기도 용인시 힐스테이트서천', '200,000,000', '20,000', 37, 44),
	createData('테라펀딩','양평 서종 타운하우스', '300,000,000', '150,000', 24, 15),
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
	   }
	}
);

export default function Funding() {
	const classes = useStyles()
		return (
			<>
			<Typography variant="h5">📟 내 투자 관리</Typography>
				<div className={classes.funding}>

					<div className={classes.totalFunding}>
						<Typography variant="h6">총 투자 내역</Typography>
						<p>누적 투자액, 투자 상품 개수, 연결된 p2p 업체 개수, 총 예치금</p>
					</div>

					<div className={classes.detailFunding}>
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
				</div>
			</>
		);
}
