import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { pointInfo } from '../../../../Interface/Point'
import { KeyboardDatePicker } from "@material-ui/pickers";
import {Button,Card,CardContent,CardActions,CardHeader,TablePagination} from '@material-ui/core'
import { userInfo } from '../../../../Interface/User';
import PointList from './PointList';

import PetsIcon from '@material-ui/icons/Pets';
import ShareIcon from '@material-ui/icons/Share';
import CreateIcon from '@material-ui/icons/Create';
import BusinessIcon from '@material-ui/icons/Business';
import { makeStyles } from '@material-ui/styles';
interface PointProps {
	userObj : userInfo | null,
}
const useStyles= makeStyles( {
     pointEvent: {
          listStyle: 'none',
          display:'flex',
          justifyContent:'space-around', 
          textAlign: "center",
          padding: 0,
     }
})
export default function Point(props: PointProps) {
     const classes = useStyles()
     const { userObj } = props;
     const [pointList, setPointList] = useState<pointInfo[]>([])
     const [selectedDate, handleDateChange] = React.useState<Date | null>(new Date());
     
     useEffect(() => {
          if( userObj !== null) {
			axios.post('http://192.168.0.69:8000/api/auth/my_point_list', 
               {
                    "page_size" : 30,
                    "start" : "2021-04-14",
                    "end": "2021-04-19"
               },
			{
				headers : {
				"Authorization": "Token " + userObj.auth_token,
			}
			})
			.then(res => {
                    setPointList(res.data.results)
               })
			.catch(function(error) {
				console.log(error);
			})
		}		
     }, [])

     return (
          <>
               <Card>
                    <CardHeader 
                    style={{textAlign: 'center'}}
                    title="💰POINT💰"
                    />
                    <CardContent>
                         <ul className={classes.pointEvent} >
                              <li><PetsIcon fontSize="large"/><p>출석</p></li>
                              <li><ShareIcon fontSize="large"/><p>친구 초대</p></li>
                              <li><CreateIcon fontSize="large"/><p>글, 댓글 작성</p></li>
                              <li><BusinessIcon fontSize="large"/><p>기업 연동</p></li>
                         </ul>
                    </CardContent>

                    <CardActions style={{display:'flex', flexDirection:"column"}}>
                              <div>
                                   <KeyboardDatePicker
                                        placeholder="2021/01/01"
                                        value={selectedDate}
                                        onChange={date => handleDateChange(date)}
                                        format="yyyy/MM/dd"
                                   />
                                   <KeyboardDatePicker
                                        placeholder="2018/10/10"
                                        value={selectedDate}
                                        onChange={date => handleDateChange(date)}
                                        format="yyyy/MM/dd"
                                   />
                              </div>
                              

                              <Button>조회</Button>
                    </CardActions>


               </Card>

               {console.log(pointList)}
               <>
                    {pointList && pointList.map((point,index) => {
                         return (
                              <PointList key={index} point={point}/>
                         )
                         
                    })}
               </>
          </>
     )
}
