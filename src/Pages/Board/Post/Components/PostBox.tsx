import axios from 'axios';
import { useHistory } from 'react-router';

import { makeStyles } from '@material-ui/styles';
import { Icon, Table, TableBody , TableCell, TableContainer ,TableHead ,TableRow,
     useMediaQuery}
          from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import {postInfo} from 'Interface/Board'
import ForumTwoToneIcon from '@material-ui/icons/ForumTwoTone';
import ThumbUpAltTwoToneIcon from '@material-ui/icons/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@material-ui/icons/ThumbDownAltTwoTone';
import Search from 'Pages/Board/Search/Search';

const useStyles = makeStyles({
     postBox: {
       maxHeight: 600,
     },
     postBoxMobile : {
          width: "100%",
          height: "10%",
     },
     postItem: {
          display:'flex', 
          flexDirection:'column', 
          padding: '5px',
          width: '100%',
          borderBottom: '1px solid #cfcfcf',
          '& td': {
               padding: '10px',
               border: 'none',
          }
     },
     commentCount : {
          color: '#0277bd',
          '& b': {
               fontSize: '12px',
          }
     },
     tdSet: {
          display:'flex', 
          flexDirection:'row',
          justifyContent: 'flex-start',
          '& td': {
               color: '#9e9e9e',
               '& span': {
                    display:'inline-block',
                    lineHeight: '25px',
                    verticalAlign: 'top',
                    marginLeft: '3px'
               },
          },
     },
     pagination : {
          display:'flex', 
          justifyContent: 'center',
           margin: '20px',
          '& > ul': {
               flexWrap: "nowrap",
          }
     }
   });

interface Column {
     id: 'date' | 'title' | 'author' | 'visited' | 'like' | 'unlike';
     label: string;
     minWidth?: number;
     align?: 'center';
}

interface PostBoxProps {
     categoryId: number
     postList : postInfo
     rowsPerPage: number
     page:number
     handleChangePage: (event: React.ChangeEvent<unknown> , newPage: number) => void,
     handleIsSearching: (value: boolean) => void,
     getPostList: (url: string, pageIndex?:number) => void
}
// todo: 실제 탭 컨테이너 내부 컴포넌트 
export default function PostBox(props: PostBoxProps) {
     const classes = useStyles();
     const isMobile = useMediaQuery("(max-width: 380px)");

     const history = useHistory();
     const { postList, rowsPerPage, page, handleChangePage, getPostList,handleIsSearching,categoryId } = props;
     const { count, results } = postList;

     const columns: Column[] = [
          { id: 'date', align:'center', label: '날짜', minWidth: 100 },
          { id: 'title', align:'center',label: '제목', minWidth: 200 },
          { id: 'author', align:'center',label: '글쓴이', minWidth: 50 },
          { id: 'visited', align:'center',label: '조회', minWidth: 50 },
          { id: 'like', align:'center',label: '공감', minWidth: 50 },
          { id: 'unlike', align:'center',label: '비공감', minWidth: 50 },
     ];
     

     // 게시글 조회수 업데이트 및 상세 게시글 페이지로 이동 
     const handleClickPost = (postId : number) : void => {
          axios.post(`${process.env.REACT_APP_SERVER}/api/notice/update_view`, {
                    post_id: postId
               }).then(res => {
               history.push(`/board/category=${categoryId}/detail/${postId}`, {
                    post_id: postId,
                    category_id: categoryId
               })
          })
          .catch(function(error) {
               console.log(error);
          })
     }
     
     return (
          <>
               <TableContainer className={isMobile? classes.postBoxMobile : classes.postBox}>
                    <Table stickyHeader aria-label="sticky table">
                         { !isMobile && 
                              <TableHead>
                                   <TableRow>
                                   {columns.map((column) => (
                                        <TableCell
                                        key={column.id}
                                        style={{ width: column.minWidth }}
                                        align={column.align}
                                        >
                                        {column.label}
                                        </TableCell>
                                   ))}
                                   </TableRow>
                              </TableHead>
                         }
                         <TableBody>
                              {results.map((row) => {
                                   return (
                                        <TableRow hover role="checkbox" tabIndex={-1} 
                                        key={row.post_id} onClick={() => handleClickPost(row.post_id)}
                                        style={{ cursor: "pointer",}}>

                                             {isMobile ? 
                                             <div className={classes.postItem}>
                                                  <TableCell>
                                                       <span>{row.title} </span>
                                                       {row.comment_count !== 0 && <span className={classes.commentCount}> (<b>{row.comment_count}</b>)</span>}
                                                  </TableCell>
                                                  <div className={classes.tdSet}>
                                                       <TableCell align="center">{row.user.slice(0,4) + '****'}</TableCell>
                                                       <TableCell align="center">{row.date.split('T')[0].replaceAll('-','. ')}</TableCell>
                                                       <TableCell align="center">조회수 {row.views}</TableCell>
                                                  </div>
                                                  <div className={classes.tdSet}>
                                                       <div>
                                                            <TableCell align="center">
                                                                 <Icon color={row.like !== 0 ? 'action' : 'disabled'}>
                                                                      <ThumbUpAltTwoToneIcon fontSize="small"/>
                                                                 </Icon>
                                                                 <span>{row.like}</span>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                 <Icon color={row.dislike !== 0 ? 'action' : 'disabled'}>
                                                                      <ThumbDownAltTwoToneIcon fontSize="small"/>
                                                                 </Icon>
                                                                 <span>{row.dislike}</span>
                                                            </TableCell>
                                                       </div>
                                                       <div>
                                                            <TableCell>
                                                                 <Icon color={row.comment_count !== 0 ? 'action' : 'disabled'}>
                                                                      <ForumTwoToneIcon fontSize="small"/>
                                                                 </Icon>
                                                                 <span>{row.comment_count}</span>
                                                            </TableCell>
                                                       </div>
                                                  </div>
                                             </div>
                                             :
                                             <>
                                                  <TableCell align="center">{row.date.split('T')[0].replaceAll('-','. ')}</TableCell>
                                                  <TableCell>
                                                       <span>{row.title} </span>
                                                       {row.comment_count !== 0 && <span className={classes.commentCount}> (<b>{row.comment_count}</b>)</span>}     
                                                  </TableCell>
                                                  <TableCell align="center">{row.user.slice(0,4) + '****'}</TableCell>
                                                  <TableCell align="center" style={{color: '#9e9e9e'}}>{row.views}</TableCell>
                                                  <TableCell 
                                                       align="center" 
                                                       {...(row.like !== 0) 
                                                            ? { style: {color: 'red', fontWeight: 'bold'}} 
                                                            : { style: {color: '#9e9e9e', fontWeight: 'bold'}} } 
                                                       >{row.like}</TableCell>
                                                  <TableCell 
                                                       align="center" 
                                                       {...(row.dislike !== 0) 
                                                            ? { style: {color: 'blue', fontWeight: 'bold'}} 
                                                            : { style: {color: '#9e9e9e', fontWeight: 'bold'}} } 
                                                       >{row.dislike}</TableCell>
                                             </>
                                             }
                                        </TableRow>
                                   )
                              })}
                         </TableBody>
                         
                    </Table>
               </TableContainer>

               <Pagination 
                    showFirstButton showLastButton
                    className={classes.pagination}
                    count={Math.floor(count / rowsPerPage) + 1} 
                    variant="outlined" 
                    color="primary" 
                    page={page}
                    onChange={handleChangePage}
                    defaultPage={1}
               />
               <Search getPostList={getPostList} handleIsSearching={handleIsSearching}/>
          </>
     )
}
