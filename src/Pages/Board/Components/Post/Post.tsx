import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Container, Tabs,Tab,Typography,Box} from '@material-ui/core';
import { makeStyles, } from "@material-ui/core/styles";
import ChatIcon from '@material-ui/icons/Chat';
import HearingIcon from '@material-ui/icons/Hearing';
import { categoryInfo } from '../../../../Interface/Category';
import { postInfo } from '../../../../Interface/Post';
import PostBox from './Components/PostBox';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
const useStyles = makeStyles({
     postContainer : {
          flexGrow: 1,
          width: '100%',
     },
     tabPanel: {

     }
   
})
interface PostProps { 
     categories: categoryInfo[]
     categoryId :number
     handleCategoryId: any
}
// 카테고리탭 + 탭 패널 
export default function Post(props: PostProps) {
     const classes = useStyles()
     const {categories ,handleCategoryId,categoryId} = props;
     
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
     const getPostList = (url: string) => {
          if(url.length === 0){
               url = "http://192.168.0.69:8000/api/notice/post_list"
          }
          axios.post(url, {
               "category_id": categoryId,
               "page_size": rowsPerPage
          })
          .then(res => {
               console.log('postlist',res.data)
               setpostList(res.data)
               setIsLoading(false)
          }) 
          .catch(function(error) {
               console.log(error);
               })
     }

     // 카테고리 ID가 변경되면 LIST 업데이트
     useEffect(() => {
          getPostList("")
          setPage(0)
     }, [categoryId, rowsPerPage])
     return (
         
          <Container maxWidth="md" className={classes.postContainer}>
               <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
               >
                    {categories.map( (category,index) => {
                         return (
                              <Tab key={index} label={category.category_name} icon={iconList[index]} {...a11yProps(index)} />
                         )
                    })}
               </Tabs>

                    {isLoading ? 
                         '로딩중'
                    :
                    <>
                         <TabPanel value={value} index={0}>
                              <PostBox page={page} 
                              rowsPerPage={rowsPerPage} 
                              handleChangePage={handleChangePage} 
                              handleChangeRowsPerPage={handleChangeRowsPerPage}
                               postList={postList}/>
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
