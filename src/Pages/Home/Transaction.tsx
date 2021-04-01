import {Typography,Paper} from "@material-ui/core";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
// TODO: 입출금 내역 
export default function Transaction() {
     return (
          <div className="transaction">
               <Typography variant="h5">🔥 한눈에 보는 입출금 내역</Typography>
               {/* 입출금 내역 리스트 */}
               <div className="transaction-list">
                    <FormatListBulletedIcon /> 입출금 내역 리스트
                    {/* 충전, 출금, 계좌내역  */}
               </div>

               {/* 달력으로 보는 월간 내역 */}
               <div className="calendar">
                         <CalendarTodayIcon /> 월간 내역
                    <Paper>

                    </Paper>
               </div>

          </div>
     )
}
