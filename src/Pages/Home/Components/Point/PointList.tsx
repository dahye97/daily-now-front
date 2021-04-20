import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { pointInfo } from '../../../../Interface/Point'

type pointType = {
     point : pointInfo
}
const useStyles = makeStyles ({
     pointItem: {
          textAlign: 'right',
          margin: '10px',
          padding: '5px',
          background: '#ECF0F3'
     },         
     plusPoint: {
          color: "red"
     },
     minusPoint: {
          color: 'blue'
     }
})
export default function PointList(props : pointType) {
     const classes = useStyles()
     const { action, point, total_point, detail_action, date } = props.point
     return (
          <Paper className={classes.pointItem}>
               <ul style={{listStyle: 'none'}}>
                    <li>{action}</li>
                    <li className={point.toString().slice(0,1) === '-' ? classes.minusPoint : classes.plusPoint }>
                         <b>{point.toString().slice(0,1) !== '-' ? '+' + point : point}</b>
                    </li>
                    <li><b>{total_point}</b> P</li>
                    <li>{detail_action}</li>
                    <li>{date.getDate}</li>
               </ul>
 
          </Paper>
     )
}
