import React, {useState,useEffect} from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { useLocation, } from 'react-router';
import queryString from 'query-string'

import { IconButton,InputBase,Paper,FormControl,InputLabel, NativeSelect,useMediaQuery,Select } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
     padding: '2px 4px',
     display: 'flex',
     maxWidth:'800px',
     marginBottom: '20px',
    },
    rootMobile: {
     flexDirection:'column'
},
    container: {
     display:'flex',
     flexDirection:'row',
     flex: 1,
     maxWidth:'200px'
    },
    keywordContainer: {
     display:'flex',
     flexDirection:'row',
     flex : 1
    },
    containerMobile : {
     display:'flex',
     flexDirection:'row',
     justifyContent:'center',
     width: '100%',
    },
    formControl: {
     margin: theme.spacing(1),
     flex: 1,
   },
   selectEmpty: {
     marginTop: theme.spacing(2),
   },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  }),
);

interface searchProps {
     getUserList: (size: number, type: string | string[] | null, keyword: string | string[] | null, url?:string, pageIndex?: number) => void
     rowsPerPage: number, 
     handleChangeRowsPerPage: (event: React.ChangeEvent<{value: unknown}>) => void,

     handleIsSearching : (value: boolean) => void
}


export default function UserSearch(props: searchProps ) {
     const { getUserList,rowsPerPage, handleChangeRowsPerPage, handleIsSearching} = props
     const classes = useStyles();
     const isMobile = useMediaQuery("(max-width: 380px)");

     const location = useLocation()
	const queryObj = queryString.parse(location.search);


     // 검색 분류
     const [type, setType] = useState<string | string[] | null>("username")
     const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setType(e.target.value)
     }
     // 검색어
     const [keyword, setKeyword] = useState<string| string[] | null>("")
     const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
          setKeyword(e.target.value)
     }

     const handleSearch = () => {
          handleIsSearching(true)
          getUserList(rowsPerPage, type, keyword, undefined, 1)
     }

     return (
          <Paper className={isMobile? classes.rootMobile: classes.root}>

               <div className={classes.container}>
               <FormControl className={classes.formControl}>
                         <InputLabel>표시글수</InputLabel>
                         <NativeSelect
                              value={rowsPerPage}
                              onChange={handleChangeRowsPerPage}
                         >
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={30}>30</option>
                         </NativeSelect>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                         <InputLabel>검색유형</InputLabel>
                         <NativeSelect
                              value={type}
                              onChange={handleChangeType}
                         >
                              <option value={"username"}>이름</option>
                              <option value={"email"}>이메일</option>
                              <option value={"date_joined"}>가입일자</option>
                         </NativeSelect>
                    </FormControl>
               </div>

               <div className={classes.keywordContainer}>
                    <InputBase
                    onKeyPress={ (event) => {
                         if (event.key === 'Enter') {
                              handleSearch()
                         }
                    }}
                    className={classes.input}
                    placeholder="검색어를 입력해주세요."
                    onChange={handleChangeKeyword}
                    value={keyword}
                    />
                    <IconButton className={classes.iconButton} onClick={handleSearch}>
                         <SearchIcon />
                    </IconButton>
               </div>
          </Paper>
     )
}
