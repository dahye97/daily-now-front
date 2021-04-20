import React from 'react'
import { Typography } from "@material-ui/core";
import { fundInfo } from '../../../../Interface/User';

interface BalanceProps {
     fund: fundInfo
}
export default function Balance(props: BalanceProps) {
     const {total_investment ,number_of_investing_products,residual_investment_price} = props.fund;
     console.log(props.fund)
     return (
          <div>
               <Typography  variant="h5">🔒 잔고</Typography>	
               <ul>
                    <li>누적 투자액 {total_investment}</li>
                    <li>투자 상품 수 {number_of_investing_products}</li>
                    <li>총 투자 잔액 {residual_investment_price}</li>
               </ul> 
          </div>
     )
}
