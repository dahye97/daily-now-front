import React,{useState,useEffect} from 'react'
import axios from 'axios'
import queryString from 'query-string'

import { makeStyles, } from "@material-ui/core/styles";
import {Container,Typography,Box, useMediaQuery, FormControl, Select} from '@material-ui/core';

import PostBox from 'Pages/Board/Post/Components/PostBox';
import { postInfo,categoryInfo, searchInfo } from 'Interface/Board';
import { useHistory, useLocation } from 'react-router';
// todo: 카테고리 탭 & 탭 컨테이너 컴포넌트
const useStyles = makeStyles({
     postContainer : {
          flexGrow: 1,
          width: '100%',
          padding: 0
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

     const {categories ,categoryId, pageIndex} = props;
     const location = useLocation<locationProps>()
	const queryObj = queryString.parse(location.search);

     const [isLoading, setIsLoading] = useState(true)
     const [value, setValue] = React.useState(0);
     const [postList, setpostList] = useState<postInfo>(Object) // 글 목록 
     
     // Sort, Pagination 상태 관리 및 메소드 
     const [sortInput, setSortInput] = useState("date")
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
     const handleChangePage = (event: React.ChangeEvent<any> , newPage: number) => {
         let label = event.currentTarget.getAttribute("aria-label")
          handleIsSearching(false)
          let nextPage = newPage;
          if( ["Go to next page", "Go to previous page"].includes(label) ) { // +10, -10 페이지 이동 
               if( newPage > page ) {
                    nextPage += 9
               }else nextPage -= 9
               if( nextPage > Math.floor(postList.count / rowsPerPage + 1) ){
                    nextPage = Math.floor(postList.count / rowsPerPage + 1)
               }else if(nextPage < 1){
                    nextPage = 1
               }           
          }
          setPage(nextPage);
          if(keyword){
               history.push(`/board?category=${categoryId}&keyword=${keyword}&sort=${sort}&type=${type}&page=${nextPage}`)
          }else history.push(`/board?category=${categoryId}&page=${nextPage}`)
          window.scrollTo(0, 0);
     };
     // rowsperpage 인풋 핸들러
     const handleChangeRowsPerPage = (event: React.ChangeEvent<{value: unknown}>) => {
       setRowsPerPage(+(event.target.value as number));
       setPage(1);
     };

     // sort 인풋 핸들러
     const handleChangeSort = (event: React.ChangeEvent<{value: unknown}>) => {
          setSortInput(event.target.value as string)
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
               sort:sortInput
          }
          if( searchData ) { // 검색 기능 O
               data = {
                    category_id: searchData.category_id,
                    search_type: searchData.search_type,
                    page_size: rowsPerPage,
                    search_keyword: searchData.search_keyword,
                    sort: sortInput
               }
          }
          axios.post(url,data)
          .then(res => {
               if(pageIndex){
                    setPage(pageIndex)
               }
               if( searchData) {
                    let categoryId = searchData.category_id
                    history.push(`/board?category=${categoryId}&keyword=${searchData.search_keyword}&sort=${searchData.sort}&type=${searchData.search_type}&page=${pageIndex}`
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

     // 카테고리, rowsperpage, page index 가 변경되면 업데이트
     useEffect(() => {
          // 초기 렌더링
          if(!categoryId && !page && !keyword){
               getPostList("") // 카테고리의 게시물 불러오기
          }

          // 페이지 이동할 때 
          if( categoryId >= 0 && pageIndex ){
               let nextPage = pageIndex
               if( pageIndex >= Math.floor(postList.count / rowsPerPage + 1)) {
                    nextPage = Math.floor(postList.count / rowsPerPage + 1)
               }
               if( !keyword) {
                    getPostList("",nextPage) // 카테고리의 선택 페이지 게시물 불러오기
               }else if( !isSearching ){ // 검색 기능 이용할 때
                    let data = {
                         category_id: categoryId,
                         page_size: rowsPerPage,
                         search_type: type,
                         search_keyword: keyword,
                         sort: sortInput
                    }
                    getPostList("",nextPage,data)
               }
          }
          setValue(categoryId) // 현재 카테고리 위치 ui value 값 설정
          
     }, [categoryId, rowsPerPage, pageIndex, sortInput])

     useEffect(() => {
         if(keyword){
          //     console.log(keyword, location.state.postList)
              setIsLoading(false)
              setpostList(location.state.postList)
         }
     }, [keyword])
     return (
         
          <Container maxWidth="md" className={isMobile ? classes.postContainerMobile : classes.postContainer}>
               <div style={{display:'flex', justifyContent: 'space-between', paddingTop: '24px'}}>
                    {/* 정렬기준 */}
                    <FormControl className={classes.viewForm}>
                         <div>
                              <Select
                                   native
                                   inputProps={{
                                        name: 'Sort',
                                        id: 'sort-label'
                                   }}
                                   value={sortInput}
                                   onChange={handleChangeSort}
                                   >
                                   <option value={"date"}>최신순</option >
                                   <option value={"like"}>인기순</option >
                                   <option value={"views"}>조회순</option >
                                   <option value={"comment"}>댓글순</option >
                              </Select>
                              <label style={{ color: "#0000008A", fontSize: '13px' }}>으로 보기</label>
                         </div>
                    </FormControl>
                    {/* 게시글 수 설정 */}
                    <FormControl className={classes.viewForm}>
                         <div>
                              <Select
                                   native
                                   inputProps={{
                                        name: 'View',
                                        id: 'view-label'
                                   }}
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
               </div>

               {isLoading ? 
                    <div>Loading...</div>
               :
               <>
               {categories.map( (cat) => {
                    return (
                         <TabPanel key={cat.category_id} value={value} index={cat.category_id}>
                              <PostBox 
                                   categoryId={categoryId}
                                   page={page} 
                                   rowsPerPage={rowsPerPage} 
                                   handleChangePage={handleChangePage} 
                                   postList={postList}
                                   getPostList={getPostList}
                                   handleIsSearching={handleIsSearching}
                              />
                         </TabPanel>
                    )
               })}
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