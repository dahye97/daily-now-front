import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

import { Tabs, Tab, useMediaQuery } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import HearingIcon from "@material-ui/icons/Hearing";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import ForumIcon from "@material-ui/icons/Forum";
import { makeStyles } from "@material-ui/core/styles";

import { categoryInfo } from "Interface/Board";

const useStyles = makeStyles({
  postContainer: {
    flexGrow: 1,
    width: "100%",
    padding: 0,
  },
  postContainerMobile: {
    padding: 0,
    margin: 0,
  },
  tabs: {
    margin: "10px 0",
  },
  tabsMobile: {
    "& div": {
      justifyContent: "space-evenly",
    },
  },
  viewForm: {
    margin: "0 25px",
    display: "flex",
    alignItems: "flex-end",
  },
});

interface CategoryProps {
  categories: categoryInfo[];
  categoryId: number;
  handleCategoryId: any;
  pageIndex?: number | null;
}

interface stateType {
  post_id: number;
  category_id: number;
}

export default function Category(props: CategoryProps) {
  const { categories, handleCategoryId, categoryId } = props;
  const classes = useStyles();
  const location = useLocation<stateType>();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 380px)");

  const [value, setValue] = useState(0);

  /**
   * 카테고리 아이콘 리스트
   */
  const iconList = [
    <ChatIcon />,
    <ForumIcon />,
    <HearingIcon />,
    <InsertEmoticonIcon />,
  ];

  /**
   * 카테고리 ID 변경 함수
   * @param event ChangeEvent
   * @param newValue 이동하려는 카테고리 ID
   */
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    handleCategoryId(newValue);
  };

  const onClickCategory = (categoryId: number) => {
    history.push(`/board?category=${categoryId}&page=1`);
  };

  // 현재 위치한 카테고리가 있을 경우 State에 저장
  useEffect(() => {
    if (location.state) {
      setValue(location.state.category_id);
    } else {
      setValue(categoryId);
    }
  }, [categoryId]);

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        className={isMobile ? classes.tabsMobile : classes.tabs}
        {...(isMobile ? {} : { variant: "scrollable", scrollButtons: "on" })}
      >
        {categories.map((category, index) => {
          if (!category.flag) {
            return (
              <Tab
                key={index}
                value={category.category_id}
                onClick={() => onClickCategory(category.category_id)}
                label={category.category_name}
                icon={iconList[index]}
                {...a11yProps(index)}
              />
            );
          }
        })}
      </Tabs>
    </>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
