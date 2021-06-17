import { useState } from "react";
import AppRouter from "./Router";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core";
const theme = unstable_createMuiStrictModeTheme({
  typography: {
    fontFamily: "Noto Sans KR",
  },
});
function App() {
  const [isInit, setisInit] = useState(true);
  return (
    <>
      {isInit ? (
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <AppRouter />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      ) : (
        "동기화 중입니다."
      )}
    </>
  );
}

export default App;
