import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { userInfo } from '../../../Interface/User'
import { pointInfo } from '../../../Interface/Point'

interface PointProps {
	userObj : userInfo | null,
}

export default function Point(props: PointProps) {

     const { userObj } = props;
     const [point, setPoint] = useState<pointInfo[]>([])
     useEffect(() => {
          if( userObj !== null) {
			axios.get('http://192.168.0.69:8000/api/auth/my_point_list', 
			{
				headers : {
				"Authorization": "Token " + userObj.auth_token,
			}
			})
			.then(res => {
                    setPoint(res.data)
                    console.log(res.data)
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
