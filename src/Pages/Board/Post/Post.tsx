import React,{useState,useEffect} from 'react'
import axios from 'axios'

import { makeStyles, } from "@material-ui/core/styles";
import {Container, Tabs,Tab,Typography,Box, useMediaQuery} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import HearingIcon from '@material-ui/icons/Hearing';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import PostBox from 'Pages/Board/Post/Components/PostBox';
import { postInfo,categoryInfo } from 'Interface/Board';
import { useHistory } from 'react-router';
const useStyles = makeStyles({
     postContainer : {
          flexGrow: 1,
          width: '100%',
     },
     postContainerMobile: {
         padding: 0,
         margin: 0,
     },

     tabsMobile :{
          '& div': {
               justifyContent: 'space-evenly',
          }
     }
   
})
interface PostProps { 
     categories: categoryInfo[]
     categoryId :number
     handleCategoryId: any
     pageIndex?: number | null 
}
// 카테고리탭 + 탭 패널 
export default function Post(props: PostProps) {
     const classes = useStyles()
     const history = useHistory()
     const isMobile = useMediaQuery("(max-width: 380px)");

     const {categories ,handleCategoryId,categoryId, pageIndex} = props;
     
     const  iconList = [<ChatIcon />, <HearingIcon />, < InsertEmoticonIcon/>]

     const [isLoading, setIsLoading] = useState(true)
     const [value, setValue] = React.useState(0);
     const [postList, setpostList] = useState<postInfo>(Object) // 글 목록 
     
     // Pagination 상태 관리 및 메소드 
     const [rowsPerPage, setRowsPerPage] = useState(10) // Rows per page 값 
     const [page, setPage] = React.useState(0);
   
     // 앞, 뒤 게시물 페이지 이동 
     const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
          if (page > newPage) { // 앞으로 이동 
               getPostList(postList.previous)
          }else {
               getPostList(postList.next)
          }
       setPage(newPage);
       history.push(`/board?category=${categoryId}&page=${newPage}`)
       window.scrollTo(0, 0);
     };
     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
       setRowsPerPage(+event.target.value);
       setPage(0);
     };
     // 게시판 탭 클릭 시, 카테고리 ID 변경
     const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
          handleCategoryId(newValue+1)
          setValue(newValue);
     };

     // 카테고리 ID와 rowsPerPage 값에 따른 게시글 가져오기 
     const getPostList = (url: string, pageIndex?:number) => {
          if(url.length === 0){
               url = `${process.env.REACT_APP_SERVER}/api/notice/post_list`
          }
          if(pageIndex) {
               url = url + `?page=${pageIndex}`
          }
          axios.post(url, {
               "category_id": categoryId,
               "page_size": rowsPerPage
          })
          .then(res => {
               setpostList(res.data)
               setIsLoading(false)
          }) 
          .catch(function(error) {
               console.log(error);
               })
     }

     const onClickCategory = (categoryId : number) => {   
          history.push(`/board?category=${categoryId}`)
     }

     // 카테고리, 페이지가 변경되면 업데이트
     useEffect(() => {
          // 선택한 카테고리가 있을 경우
          if( categoryId && !pageIndex) {
               getPostList("") // 카테고리의 게시물 불러오기
               setPage(0) // 페이지 값 초기화
          }
          // 선택한 카테고리와 선택한 페이지가 있을 경우
          else if( categoryId && pageIndex ){
               getPostList("",pageIndex+1) // 카테고리의 선택 페이지 게시물 불러오기
               setPage(pageIndex) // 페이지 값 업데이트
          }
          setValue(categoryId-1) // 현재 카테고리 위치 ui value 값 설정
     }, [categoryId, rowsPerPage, pageIndex])
     return (
         
          <Container maxWidth="md" className={isMobile ? classes.postContainerMobile : classes.postContainer}>
               <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    className={isMobile? classes.tabsMobile: ""}
                    { ...isMobile? {} : {variant : "scrollable", scrollButtons : "on"}}
               >
                    {categories.map( (category,index) => {
                         return (
                              <Tab 
                                   key={index} 
                                   onClick={() => onClickCategory(category.category_id)} 
                                   label={category.category_name} 
                                   icon={iconList[index]} {...a11yProps(index)} 
                              />
                         )
                    })}
               </Tabs>

               {isLoading ? 
                    <div>Loading...</div>
               :
               <>
                    <TabPanel value={value} index={0}>
                         <PostBox 
                              page={page} 
                              rowsPerPage={rowsPerPage} 
                              handleChangePage={handleChangePage} 
                              handleChangeRowsPerPage={handleChangeRowsPerPage}
                              postList={postList}
                         />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                         <PostBox page={page} rowsPerPage={rowsPerPage} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} postList={postList}/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                         <PostBox page={page} rowsPerPage={rowsPerPage} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} postList={postList}/>
                    </TabPanel>
               </>}
                    
          </Container>
     )
}

interface TabPanelProps {
     children?: React.ReactNode;
     index: any;
     value: any;
   }


function TabPanel(props: TabPanelProps) {
     const { children, value, index, ...other } = props;
     return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box p={3}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
}
function a11yProps(index: any) {
     return {
       id: `scrollable-auto-tab-${index}`,
       'aria-controls': `scrollable-auto-tabpanel-${index}`,
     };
}
