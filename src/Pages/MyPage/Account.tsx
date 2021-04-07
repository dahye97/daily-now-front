import React from 'react'
import { Typography } from "@material-ui/core";
import { makeStyles  } from "@material-ui/core/styles";
import { accountInfo } from '../../Interface/User';

const useStyles = makeStyles({
	accountContainer: {

     }
});
export default function Account(props: {account: accountInfo}) {
     const classes = useStyles();
     return (
          <div>
			<Typography variant="h5">💳 보유 계좌 관리</Typography>
               <div className={classes.accountContainer}>
                    <ul>
                         <li>은행명 {props.account.bank}</li>
                         <li>예금주 {props.account.account_holder}</li>
                         <li>계좌번호 {props.account.account_number}</li>
                    </ul>
               </div>
          </div>
     )
}
