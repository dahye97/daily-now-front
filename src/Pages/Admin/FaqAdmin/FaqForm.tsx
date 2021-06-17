import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";

import {
  Button,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Select,
  MenuItem,
} from "@material-ui/core";

import { userInfo } from "Interface/User";
import { faqInfo } from "Interface/FAQ";

interface FaqFormProps {
  userObj: userInfo;
  selectedFaq: faqInfo[];
  faqCount: number; // faq 개수

  handleIsUpdated: () => void;
}

export default function FaqForm(props: FaqFormProps) {
  const { userObj, selectedFaq, faqCount, handleIsUpdated } = props;
  const history = useHistory();

  const [order, setOrder] = useState(selectedFaq[0].order);
  const [question, setQuestion] = useState(selectedFaq[0].question);
  const [answer, setAnswer] = useState(selectedFaq[0].answer);

  const editUrl = () => {
    let urlQuery = "update_faq";
    let data = {};

    // faq 순서 수정 시
    if (order !== selectedFaq[0].order) {
      urlQuery = "update_faq_order";
      data = {
        faq_id: selectedFaq[0].id,
        new_order: order,
      };
      handleSubmit(urlQuery, data);
    }

    // faq 내용 수정 시
    if (
      question !== selectedFaq[0].question ||
      answer !== selectedFaq[0].answer
    ) {
      data = {
        new_question: question,
        new_answer: answer,
        faq_id: selectedFaq[0].id,
      };
      handleSubmit(urlQuery, data);
    }
  };

  const handleSubmit = (urlQuery: string, data: {}) => {
    axios
      .post(`${process.env.REACT_APP_SERVER}/api/admin/faq/${urlQuery}`, data, {
        headers: {
          Authorization: "Token " + userObj.auth_token,
        },
      })
      .then((res) => {
        alert("FAQ 수정이 완료되었습니다.");
        handleIsUpdated();
        history.push("/admin/faq_admin");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push("/admin/faq_admin");
  };

  return (
    <>
      <h2>FAQ 수정</h2>

      {selectedFaq && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <FormControl style={{ marginBottom: "20px" }}>
            <InputLabel id="order">노출 순서</InputLabel>
            <Select
              labelId="order"
              id="demo-simple-select"
              value={order}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                console.log(order, event.target.value);
                setOrder(event.target.value as number);
              }}
            >
              {[...Array(faqCount)].map((e, i) => {
                return <MenuItem value={i + 1}>{i + 1}</MenuItem>;
              })}
            </Select>
            <FormHelperText>변경하실 노출 순서를 설정해주세요. </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: "20px" }}>
            <InputLabel htmlFor="question">질문</InputLabel>
            <Input
              id="question"
              value={question}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuestion(e.currentTarget.value)
              }
            />
            <FormHelperText>
              변경하실 새로운 질문 내용을 입력해주세요.
            </FormHelperText>
          </FormControl>
          <FormControl style={{ marginBottom: "20px" }}>
            <InputLabel htmlFor="answer">답변</InputLabel>
            <Input
              multiline
              id="answer"
              value={answer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAnswer(e.currentTarget.value)
              }
            />
            <FormHelperText>
              변경하실 새로운 답변 내용을 입력해주세요.
            </FormHelperText>
          </FormControl>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Button color="primary" variant="outlined" onClick={editUrl}>
          저장하기
        </Button>
        <Button color="primary" variant="outlined" onClick={handleCancel}>
          취소하기
        </Button>
      </div>
    </>
  );
}
