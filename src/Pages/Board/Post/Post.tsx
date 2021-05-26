import React,{useState,useEffect} from 'react'
import axios from 'axios'
import queryString from 'query-string'

import { makeStyles, } from "@material-ui/core/styles";
import {Container, Tabs,Tab,Typography,Box, useMediaQuery, FormControl, Select} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import HearingIcon from '@material-ui/icons/Hearing';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import PostBox from 'Pages/Board/Post/Components/PostBox';
import { postInfo,categoryInfo, searchInfo } from 'Interface/Board';
import { useHistory, useLocation } from 'react-router';
// todo: 카테고리 탭 & 탭 컨테이너 컴포넌트
const useStyles = makeStyles({
     postContainer : {
          flexGrow: 1,
          width: '100%',
     },
     postContainerMobile: {
         padding: 0,
         margin: 0,
     },
     tabs: {
          margin: '10px 0',
     },
     tabsMobile :{
          '& div': {
               justifyContent: 'space-evenly',
          }
     },
     viewForm: {
          margin: "0 25px" ,
          display: 'flex', 
          alignItems:'flex-end',
     },
   
})
interface PostProps { 
     categories: categoryInfo[]
     categoryId :number
     handleCategoryId: any
     pageIndex?: number | null 
}
interface locationProps {
     postList : postInfo
}
// 카테고리탭 + 탭 패널 
export default function Post(props: PostProps) {
     const classes = useStyles()
     const history = useHistory()
     const isMobile = useMediaQuery("(max-width: 380px)");

     const {categories ,handleCategoryId,categoryId, pageIndex} = props;
     const location = useLocation<locationProps>()
	const queryObj = queryString.parse(location.search);

     const  iconList = [<ChatIcon />, <HearingIcon />, < InsertEmoticonIcon/>]

     const [isLoading, setIsLoading] = useState(true)
     const [value, setValue] = React.useState(0);
     const [postList, setpostList] = useState<postInfo>(Object) // 글 목록 
     
     // Pagination 상태 관리 및 메소드 
     const [rowsPerPage, setRowsPerPage] = useState(10) // Rows per page 값 
     const [page, setPage] = React.useState(1);
     const keyword = queryObj.keyword;
     const type = queryObj.type;
     const sort = queryObj.sort;

     const [isSearching, setIsSearching] = useState(false)
     const handleIsSearching = (value: boolean) => {
          setIsSearching(value)
     }
     // 앞, 뒤 게시물 페이지 이동 
     const handleChangePage = (event: React.ChangeEvent<unknown> , newPage: number) => {
          handleIsSearching(false)
          setPage(newPage);
          if(keyword){
               history.push(`/board?category=${categoryId}&keyword=${keyword}&sort=${sort}&type=${type}&page=${newPage}`)
          }else history.push(`/board?category=${categoryId}&page=${newPage}`)
          window.scrollTo(0, 0);
     };
     const handleChangeRowsPerPage = (event: React.ChangeEvent<{value: unknown}>) => {
       setRowsPerPage(+(event.target.value as number));
       setPage(1);
     };
     // 게시판 탭 클릭 시, 카테고리 ID 변경
     const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
          handleCategoryId(newValue+1)
          setValue(newValue);
     };

     // 카테고리 ID와 rowsPerPage 값에 따른 게시글 가져오기 
     const getPostList = (url: string, pageIndex?:number, searchData?: searchInfo) => {
          if(url.length === 0){
               url = `${process.env.REACT_APP_SERVER}/api/notice/post_list`
          }
          if( pageIndex ) {
               url = url + `?page=${pageIndex}`
          }
          let data;
          data = { // 검색 기능 X
               category_id: categoryId,
               page_size: rowsPerPage,
               search_type: null,
               search_keyword: null,
               sort:"date"
          }
          if( searchData ) { // 검색 기능 O
               data = {
                    category_id: searchData.category_id,
                    search_type: searchData.search_type,
                    page_size: rowsPerPage,
                    search_keyword: searchData.search_keyword,
                    sort: searchData.sort,
               }
          }
          axios.post(url,data)
          .then(res => {
               if(pageIndex){
                    setPage(pageIndex)
               }
               if( searchData) {
                    history.push(`/board?category=${searchData.category_id}&keyword=${searchData.search_keyword}&sort=${searchData.sort}&type=${searchData.search_type}&page=${pageIndex}`
                    ,{
                         postList : res.data
                    })
               }
               setpostList(res.data)
               setIsLoading(false)
          }) 
          .catch(function(error) {
               console.log(error);
               })
     }

     const onClickCategory = (categoryId : number) => {   
          history.push(`/board?category=${categoryId}&page=1`)
     }

     // 카테고리, rowsperpage, page index 가 변경되면 업데이트
     useEffect(() => {

          // 초기 렌더링
          if( categoryId && !pageIndex && !keyword) {
               getPostList("") // 카테고리의 게시물 불러오기
               setPage(1) // 페이지 값 초기화
          }
          // 페이지 이동할 때 
          if( categoryId && pageIndex ){
               if( !keyword) {
                    getPostList("",pageIndex) // 카테고리의 선택 페이지 게시물 불러오기
               }else if( !isSearching ){ // 검색 기능 이용할 때
                    let data = {
                         category_id: categoryId,
                         page_size: rowsPerPage,
                         search_type: type,
                         search_keyword: keyword,
                         sort: sort
                    }
                    getPostList("",pageIndex,data)
               }
          }
          setValue(categoryId-1) // 현재 카테고리 위치 ui value 값 설정
     }, [categoryId, rowsPerPage, pageIndex])

     useEffect(() => {
         if(keyword){
              setpostList(location.state.postList)
         }
     }, [keyword])
     return (
         
          <Container maxWidth="md" className={isMobile ? classes.postContainerMobile : classes.postContainer}>
               <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    className={isMobile? classes.tabsMobile: classes.tabs}
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

               <FormControl className={classes.viewForm}>
                    <div>
                         <Select
                              native
                              inputProps={{
                                   name: 'View',
                                   id: 'view-label'
                              }}
                              // id="demo-customized-select"
                              value={rowsPerPage}
                              onChange={handleChangeRowsPerPage}
                         >
                              <option value={10}>10</option >
                              <option value={20}>20</option >
                              <option value={30}>30</option >
                         </Select>
                         <label style={{ color: "#0000008A", fontSize: '13px' }}>개씩 보기</label>
                    </div>
               </FormControl>

               {isLoading ? 
                    <div>Loading...</div>
               :
               <>
                    <TabPanel value={value} index={0}>
                         <PostBox 
                              page={page} 
                              rowsPerPage={rowsPerPage} 
                              handleChangePage={handleChangePage} 
                              postList={postList}
                              getPostList={getPostList}
                              handleIsSearching={handleIsSearching}
                         />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                         <PostBox 
                              page={page} 
                              rowsPerPage={rowsPerPage} 
                              handleChangePage={handleChangePage} 
                              postList={postList} 
                              getPostList={getPostList}
                              handleIsSearching={handleIsSearching}/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                         <PostBox 
                              page={page} 
                              rowsPerPage={rowsPerPage} 
                              handleChangePage={handleChangePage} 
                              postList={postList} 
                              getPostList={getPostList}
                              handleIsSearching={handleIsSearching}
                         />
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
