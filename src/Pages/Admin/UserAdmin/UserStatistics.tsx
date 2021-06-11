import { userInfo } from 'Interface/User'
import React, {useEffect,useState} from 'react'
import axios from 'axios';
import { statisticsInfo } from 'Interface/Admin';
import {Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
     ArgumentAxis,
     ValueAxis,
     Chart,
     BarSeries,
   } from '@devexpress/dx-react-chart-material-ui';
   
const useStyles = makeStyles({
     bar: {
          label: 'hello'
     }
})
interface UserStatisticsProps {
     userObj: userInfo,
     index: number
}
interface dataProps {
     newUser?: string,
     totalUser?: string,
     withdrawalUser?: string,
     
     value: number
}
export default function UserStatistics(props: UserStatisticsProps) {
     const { userObj } = props
     const [statList, setStatList] = useState<statisticsInfo>()
     const classes = useStyles()
     const getDailyStatistics = () => {
          axios.get(`${process.env.REACT_APP_SERVER}/api/admin/user/user_statics`,{
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               console.log(res.data)
               setStatList(res.data)
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     
     useEffect(() => {
          getDailyStatistics()
     }, [])

     const [dataList, setDataList] = useState<dataProps[]>([])
     useEffect(() => {
          if(statList) {
               setDataList ([
                    { newUser: "신규 가입자 수", value: statList.new_user },
                    { totalUser: "누적 회원 수", value: statList.total_user },
                    { withdrawalUser: "탈퇴 회원 수", value: statList.withdrawal_user },
                  ]);
          }
     }, [statList])
     
     return (
          <div>
               <h2>일일 회원 통계 페이지</h2>
              
              { dataList &&
                    <Paper style={{maxWidth: '1000px'}}>
                         <Chart
                              data={dataList}
                         >
                              <ValueAxis/>
                              <ArgumentAxis />
                              <BarSeries
                              barWidth={0.5}
                              valueField="value"
                              argumentField="newUser"
                              name="new user"
                              />
                              <BarSeries
                              barWidth={0.5}
                              valueField="value"
                              argumentField="totalUser"
                              name="total user"
                              />
                              <BarSeries
                              barWidth={0.5}
                              valueField="value"
                              argumentField="withdrawalUser"
                              name="withdrawal user"
                              />
                         </Chart>
                    </Paper>
               }
          </div>
     )
}
