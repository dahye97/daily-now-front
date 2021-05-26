import React, {useState} from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { IconButton,InputBase,Paper,FormControl,InputLabel, NativeSelect } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { searchInfo } from 'Interface/Board';
import { types } from 'node:util';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: "auto",
    },
    formControl: {
     margin: theme.spacing(1),
     minWidth: 120,
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
     getPostList: (url: string, pageIndex?:number, searchData?: searchInfo) => void
     handleIsSearching: (value: boolean) => void
}

export default function Search(props: searchProps ) {
     const classes = useStyles();
     const {getPostList, handleIsSearching} = props;
     const history = useHistory()

     // 카테고리
     const [category, setCategory] = useState<string | number>("all")
     const handleChangeCat = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setCategory(e.target.value)
     }
     // 검색 분류
     const [type, setType] = useState<string | null>("title_content")
     const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setType(e.target.value)
     }
     // 검색어
     const [keyword, setKeyword] = useState<string|null>("")
     const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
          setKeyword(e.target.value)
     }

     const handleSearch = () => {
          let data = {
               "category_id": category,
               "page_size": null,
               "search_type": type,
               "search_keyword": keyword,
               "sort":"date"
          }
          getPostList("",1,data)
          handleIsSearching(true)
     }

     return (
          <Paper className={classes.root}>

               <FormControl className={classes.formControl}>
                    <InputLabel>카테고리</InputLabel>
                    <NativeSelect
                         value={category}
                         onChange={handleChangeCat}
                    >
                         <option value={"all"}>전체</option>
                         <option value={1}>자유토론방</option>
                         <option value={2}>투자자후기</option>
                         <option value={3}>유머</option>
                    </NativeSelect>
               </FormControl>
               <FormControl className={classes.formControl}>
                    <InputLabel>검색범위</InputLabel>
                    <NativeSelect
                         value={type}
                         onChange={handleChangeType}
                    >
                         <option value={"title_content"}>제목+내용</option>
                         <option value={"title"}>제목</option>
                         <option value={"content"}>내용</option>
                    </NativeSelect>
               </FormControl>

               <InputBase
               className={classes.input}
               placeholder="검색어를 입력해주세요."
               onChange={handleChangeKeyword}
               value={keyword}
               />
               <IconButton className={classes.iconButton} onClick={handleSearch}>
                    <SearchIcon />
               </IconButton>
          </Paper>
     )
}
