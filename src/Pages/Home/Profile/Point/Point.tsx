import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { KeyboardDatePicker } from "@material-ui/pickers";
import {Button,Card,CardContent,CardActions,CardHeader,Select,InputLabel, FormControl} from '@material-ui/core'
import { userInfo, pointInfo  } from 'Interface/User';
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
     pointCard: {
          margin: '20px 0',
          borderRadius: '20px'
     },
     pointEvent: {
          listStyle: 'none',
          display:'flex',
          justifyContent:'space-around', 
          textAlign: "center",
          padding: 0,
     },
     viewForm: {
          margin: "20px" ,
          display: 'flex', 
          alignItems:'flex-end',
     }
})
function createDate(date: Date) : string { 
     let d = new Date(date)
     let year = d.getFullYear().toString()
     let month = (d.getMonth() + 1).toString()
     let day = d.getDate().toString()

     if( month.length < 2 ) month = '0' + month
     if( day.length < 2 ) day = '0' + day
     const start = [year, month, day].join('-');
     // console.log(start)
     return start
}
export default function Point(props: PointProps) {
     const classes = useStyles()
     const { userObj } = props;
     const [pointList, setPointList] = useState<pointInfo[]>([])
     
     const [startDate, handleStartDate] = React.useState<Date | null>(new Date());
     const [endDate, handleEndDate] = React.useState<Date | null>(new Date());
     let firstData = createDate(new Date());
     let secondData = createDate(new Date());

     const [page, setPage] = useState(10);
     const handleChange = (event:React.ChangeEvent<{ value: unknown }>) => {
          setPage(event.target.value as number);
     };

     const [nextUrl, setNextUrl] = useState('')
     const [isDisabled, setIsDisabled] = useState(false)
     const handleSearch = (event: React.MouseEvent<unknown> | null, nextUrl: string) => 
     {
          let url = `${process.env.REACT_APP_SERVER}/api/auth/my_point_list`
          // 더보기 url 처리 변수 
          if(nextUrl !== 'false' && nextUrl !== '') {
                    url = nextUrl
          }else {
               // 조회를 누르면 pointlist를 비워줘야한다. 
               setPointList([])
          }
          if(startDate && endDate) {
               firstData = createDate(startDate)
               secondData = createDate(endDate) 
          }
          if( userObj !== null && url !== 'false') {

               axios.post(url, {
                    "page_size" : page,
                    "start" : firstData,
                    "end": secondData
               },{
				headers : {
				"Authorization": "Token " + userObj.auth_token,
			}
			}).then(res => {
                         let result = res.data.results;
                         // 이전 포인트 내역이 존재할 때 
                         if(nextUrl !== 'false') {
                              result = pointList.concat(result)
                         } setPointList(result)

                         // 다음 포인트 내역이 존재할 때
                         // console.log(res.data)
                         if( res.data.next !== null ) { 
                              // console.log('다음 내역이 존재해요')  
                              setIsDisabled(false)                           
                              setNextUrl(res.data.next)
                         }else {
                              // console.log('더이상 내역이 존재하지 않아요')
                              setNextUrl('false') // 다음 포인트 내역이 존재하지 않을 때
                              setIsDisabled(true) 
                         }
               })
			.catch(function(error) {
				console.log(error);
			})
          } else {
               alert('내역이 존재하지 않습니다.')
          }
     }
     useEffect(() => {
          handleSearch(null,nextUrl)
     }, [page])

     const handleMorePoint = () => {
          handleSearch(null,nextUrl)
     }
     return (
          <>
               <Card className={classes.pointCard}>
                    <CardHeader 
                    style={{textAlign: 'center'}}
                    title="💰POINT💰"
                    />
                    
                    {/* 포인트 적립 방법 */}
                    <CardContent>
                         <ul className={classes.pointEvent} >
                              <li><PetsIcon fontSize="large" style={{color:"#795548"}}/><p>출석</p></li>
                              <li><ShareIcon fontSize="large" style={{color: "#388e3c"}}/><p>친구 초대</p></li>
                              <li><CreateIcon fontSize="large" style={{color: "#5472d3"}}/><p>게시물, 댓글</p></li>
                              <li><BusinessIcon fontSize="large" style={{color: "#ff9e80"}}/><p>기업 연동</p></li>
                         </ul>
                    </CardContent>

                    {/* 조회 기간 선택 */}
                    <CardActions style={{display:'flex', flexDirection:"column"}}>
                              <div style={{width: '100%', display:'flex', justifyContent:'space-around'}}>
                                   <KeyboardDatePicker
                                        placeholder="2021/01/01"
                                        value={startDate}
                                        onChange={date => handleStartDate(date)}
                                        format="yyyy/MM/dd"
                                        label="조회시작일"
                                   />
                                   <KeyboardDatePicker
                                        placeholder="2018/10/10"
                                        value={endDate}
                                        onChange={date => handleEndDate(date)}
                                        format="yyyy/MM/dd"
                                        label="조회종료일"
                                   />
                              </div>
                              <Button 
                              onClick={(e) => handleSearch(e, nextUrl)}
                              style={{width:'100%', margin: '10px 0'}}>조회</Button>
                    </CardActions>

               </Card>
               <>
               
                    {/* 리스트 size 선택 */}
                    <FormControl className={classes.viewForm}>
                         <div>
                              <Select
                                   native
                                   inputProps={{
                                        name: 'View',
                                        id: 'view-label'
                                   }}
                                   // id="demo-customized-select"
                                   value={page}
                                   onChange={handleChange}
                              >
                                   <option value={10}>10</option >
                                   <option value={20}>20</option >
                                   <option value={30}>30</option >
                              </Select>
                              <label style={{ color: "#0000008A", fontSize: '13px' }}>개씩 보기</label>
                         </div>
                    </FormControl>

                    {/* 포인트 카드 매핑 */}
                    {pointList && pointList.map((point,index) => {
                         return (
                              <PointList key={index} point={point} />
                         )
                         
                    })}

                    <Button disabled={isDisabled} style={{width:'100%'}} onClick={handleMorePoint}>더보기</Button>
               </>
          </>
     )
}
