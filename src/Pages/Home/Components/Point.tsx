import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { userInfo } from '../../../Interface/User'

interface PointProps {
	userObj : userInfo | null,
}

export default function Point(props: PointProps) {

     const { userObj } = props;
     // const [point, setPoint] = useState(initialState)
     useEffect(() => {
          if( userObj !== null) {
			axios.get('http://192.168.0.69:8000/api/auth/my_point_list', 
			{
				headers : {
				"Authorization": "Token " + userObj.auth_token,
			}
			})
			.then(res => {
                    console.log(res)
               })
			.catch(function(error) {
				console.log(error);
			})
		}		
     }, [])

     return (
          <div>
               포인트 컴포넌트 
          </div>
     )
}
