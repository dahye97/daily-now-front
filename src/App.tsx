import { useState } from 'react';
import AppRouter from "./Router";
import { MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns'

function App() {

  const [isInit, setisInit] = useState(true)

  return (
    <>
      {isInit? (	
            <>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <AppRouter/>
              </MuiPickersUtilsProvider>
            </>
          )
          : (
            '동기화 중입니다.'
          )}
        
    </>
  );
}

export default App;
