import { Paper  } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { pointInfo } from 'Interface/User'

const useStyles = makeStyles ({
     pointItem: {
          margin:'5px 0',
          padding: '5px',
          background: '#e3f2fd',
          borderRadius: '20px',

          '&:hover': {
               background: '#bbdefb',
               transition: "all ease 0.5s 0s",
          }
     },        
     ulTag: {
          padding: '0 10px',
          "& li" : {
               display:'flex',
               justifyContent: 'space-between',
          }
     } ,
     pointInfo : {
          color: "#707070",

     },
     plusPoint: {
          color: "red"
     },
     minusPoint: {
          color: 'blue'
     },
})
type pointType = {
     point : pointInfo
}

export default function PointList(props : pointType) {
     const classes = useStyles()

     const { action, point, total_point, detail_action, date, } = props.point
     // date 처리
     const realDate = date.split('T')[0].replaceAll('-','. ')
     return (
          <Paper className={classes.pointItem}>
               <ul className={classes.ulTag} style={{listStyle: 'none'}}>
               {props.point && 
               <>
                    <li className={classes.pointInfo}>{realDate}</li>
                    <br />
                    <li>
                         <span className={classes.pointInfo}>포인트 유형</span>
                         <span>{action}</span>
                    </li>
                    <li className={point.toString().slice(0,1) === '-' ? classes.minusPoint : classes.plusPoint }>
                         <span className={classes.pointInfo}>획득 포인트</span>
                         <b>{point.toString().slice(0,1) !== '-' ? '+' + point : point}</b>
                    </li>
                    <li>
                         <span className={classes.pointInfo}>누적 포인트</span>
                         <b>{total_point} P</b></li>
                    <li>
                         <span className={classes.pointInfo}>포인트 정보</span>
                         {detail_action}
                    </li>
               </>
               }
               </ul>
 
          </Paper>
     )
}
