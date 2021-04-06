import {Typography,Paper} from "@material-ui/core";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { makeStyles,   } from "@material-ui/core/styles";

import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
// TODO: 입출금 내역 

const useStyles = makeStyles({

     transaction : {
          padding: "30px"
     },
     transactionList : {

     },
     calendar: {

     }
})
export default function Transaction() {
     const classes = useStyles();
     return (
          <>
          <Typography variant="h5">📅 한눈에 보는 입출금 내역</Typography>
               <div className={classes.transaction}>
                    {/* 입출금 내역 리스트 */}
                    <div className={classes.transactionList}>
                         <FormatListBulletedIcon /> 입출금 내역 리스트
                         {/* 충전, 출금, 계좌내역  */}
                    </div>

                    {/* 달력으로 보는 월간 내역 */}
                    <div className={classes.calendar}>
                              <CalendarTodayIcon /> 월간 내역
                         <Paper>

                         </Paper>
                    </div>

               </div>
          </>
     )
}
