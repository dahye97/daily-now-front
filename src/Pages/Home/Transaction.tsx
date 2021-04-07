import {Typography } from "@material-ui/core";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { makeStyles  } from "@material-ui/core/styles";
import { createMuiTheme} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useState } from 'react';
import { DatePicker } from "@material-ui/pickers";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

// TODO: 입출금 내역 

const useStyles = makeStyles( (theme) => ({

     transaction : {
          padding: "30px"
     },
     calendar: {
     },
     container: {
          display: 'flex',
          flexWrap: 'wrap',
     },
        textField: {
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          width: 200,
      },
}))

const blueTheme = createMuiTheme({
     palette: {
       primary: {
            main: "#198BFB"
       } 
     },
   });

export default function Transaction() {
     const classes = useStyles();

     const [date, setDate] = useState(new Date());
 

     return (
          <>
          <Typography variant="h5">📅 한눈에 보는 월간 내역</Typography>
               <div className={classes.transaction}>
                    {/* 달력으로 보는 월간 내역 */}
                    <div className={classes.calendar}>
                         <ThemeProvider theme={blueTheme}>
                              <DatePicker
                                   autoOk
                                   orientation="landscape"
                                   variant="static"
                                   openTo="date"
                                   value={date}
                                   onChange={ (event: any) => {
                                        setDate(event)
                                   }}
                              />
                         </ThemeProvider>

                    </div>
               </div>
          </>
     )
}
