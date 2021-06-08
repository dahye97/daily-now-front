import React, {useState, useEffect} from 'react'
import { Button,FormControl, InputLabel, Input, FormHelperText,Select,MenuItem } from '@material-ui/core'
import { userInfo } from 'Interface/User'
import { categoryInfo } from 'Interface/Board';
import { useHistory } from 'react-router';
import axios from 'axios';

interface CatFormProps {
     userObj: userInfo,
     selectedCat: categoryInfo[]
     handleIsUpdated: () => void
}

export default function CategoryForm(props: CatFormProps) {
     const { userObj,selectedCat, handleIsUpdated } = props;
     const history = useHistory()

     const [newCatName, setNewCatName] = useState(selectedCat[0].category_name)
     const [flag, setFlag] = useState(selectedCat[0].flag)

     const editUrl = () => {
          let urlQuery = "update_category";
          let data = {};

          // 카테고리 flag 수정 시 
          if( flag !== selectedCat[0].flag) {
               urlQuery = "update_category_flag"
               data = {
                    "category_id": selectedCat[0].category_id,
               }
               handleSubmit(urlQuery, data)
          } 
          
          // 카테고리 이름 수정 시
          if ( newCatName !== selectedCat[0].category_name) { 
               data = {
                    "category_id": selectedCat[0].category_id,
                    "new_category_name": newCatName,
               }
               handleSubmit(urlQuery, data)
          }
     }

     const handleSubmit  = (urlQuery:string, data: {}) =>{
          axios.post(`${process.env.REACT_APP_SERVER}/api/admin/category/${urlQuery}`,
               data,
          {
               headers: {
                    "Authorization": "Token " + userObj.auth_token,
               }
          })
          .then(res => {
               alert('카테고리 수정이 완료되었습니다.')
               handleIsUpdated()
               history.push('/admin/category_admin')

          })
          .catch(function(error) {
               console.log(error);
          })
     }
     const handleCancel = () => {
          history.push('/admin/category_admin')
     }

     return (
          <>
               <h2>카테고리 수정</h2>  

          {selectedCat && 
               <div style={{display:'flex', flexDirection:"column", alignItems:'baseline'}}>
                    <FormControl style={{marginBottom:'20px'}}>
                         <InputLabel htmlFor="name">새 카테고리 이름</InputLabel>
                         <Input 
                         id="name"
                         value={newCatName} 
                         onChange={(e:React.ChangeEvent<HTMLInputElement>) => 
                              setNewCatName(e.currentTarget.value)
                         }/>
                         <FormHelperText>변경하실 새로운 카테고리 이름을 입력해주세요.</FormHelperText>
                    </FormControl>

                    <FormControl>

                         <InputLabel id="flag">공개 여부</InputLabel>
                         <Select
                              labelId="flag"
                              id="flag"
                              displayEmpty
                              value={flag}
                              onChange={(e: React.ChangeEvent<{ value: unknown }>) => 
                                   {
                                        if( e.target.value === "true") {
                                             setFlag(true)
                                        }else setFlag(false)
                                   }
                              }
                         >
                              <MenuItem value={"false"}>공개</MenuItem>
                              <MenuItem value={"true"}>비공개</MenuItem>
                         </Select>
                         <FormHelperText>공개 여부를 선택해주세요.</FormHelperText>

                    </FormControl>
               </div>
          }
          <div style={{display:'flex', alignItems:'center', marginTop: '20px'}}>
               <Button color="primary" variant="outlined" onClick={editUrl}>저장하기</Button>    
               <Button color="primary" variant="outlined" onClick={handleCancel} >취소하기</Button>    
          </div> 
          </>
     )
}
