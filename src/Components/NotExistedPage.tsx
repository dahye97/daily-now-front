import holyIcon from "asset/img/holy_404.jpg";
import { styled } from "@material-ui/core/styles";
import { Card, Typography, Container } from "@material-ui/core";

export default function NotExistedPage() {
  const NotFound = styled(Card)({
    backgroundImage: `url(${holyIcon})`,
    backgroundSize: "500px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "600px",
    boxShadow: "none",
  });

  return (
    <Container style={{ height: "100vh" }}>
      <NotFound />
      <Typography align="center">
        <div style={{ fontSize: "30px", fontWeight: "bold" }}>404 Error</div>
        <div style={{ fontSize: "20px" }}>
          요청하신 페이지를 찾을 수 없습니다.
        </div>
      </Typography>
    </Container>
  );
}
