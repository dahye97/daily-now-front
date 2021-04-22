import React from 'react'
import { Typography } from "@material-ui/core";
import { makeStyles  } from "@material-ui/core/styles";
import { accountInfo } from '../../../../Interface/User';

const useStyles = makeStyles({
	accountContainer: {

     },
     ul : {
          listStyle: 'none',
          padding: '0 40px',
          '& li' : {
               display: 'flex', 
               justifyContent:'space-between'
          }
     }
});
export default function Account(props: {account: accountInfo}) {
     const classes = useStyles();
     return (
          <div>
			<Typography variant="h5">💳 보유 계좌 관리</Typography>
               <div className={classes.accountContainer}>
                    <ul className={classes.ul}>
                         <li><h3>은행명</h3><p>{props.account.bank}</p></li>
                         <li><h3>예금주</h3><p>{props.account.account_holder}</p></li>
                         <li><h3>계좌번호</h3><p>{props.account.account_number}</p></li>
                    </ul>
               </div>
          </div>
     )
}
