import { useState } from 'react';
import AppRouter from "./Router";

function App() {

  const [isInit, setisInit] = useState(true)

  return (
    <>
      {isInit? (	
            <>
              <AppRouter isLoggedIn={false}/>
            </>
          )
          : (
            '동기화 중입니다.'
          )}
        
    </>
  );
}

export default App;
