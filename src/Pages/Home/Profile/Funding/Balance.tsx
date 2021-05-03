import React from 'react'
import { Typography } from "@material-ui/core";
import { fundInfo } from 'Interface/User';
import { makeStyles  } from "@material-ui/core/styles";


interface BalanceProps {
     fund: fundInfo
}

const useStyles = makeStyles({
     ul : {
          listStyle: 'none',
          padding: '0 40px',
          '& li' : {
               display: 'flex', 
               justifyContent:'space-between'
          }
     }
});
export default function Balance(props: BalanceProps) {
     const classes = useStyles();
     const {total_investment ,number_of_investing_products,residual_investment_price} = props.fund;
     return (
          <div>
               <Typography  variant="h5">🔒 잔고</Typography>	
               <ul className={classes.ul}>
                    <li><h3>누적 투자액</h3> <p>{total_investment}</p></li>
                    <li><h3>투자 상품 수</h3> <p>{number_of_investing_products}</p></li>
                    <li><h3>예정 상환금</h3> <p>{residual_investment_price}</p></li>
               </ul> 
          </div>
     )
}
