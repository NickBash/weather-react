import React from 'react'
import './App.css'
import Main from "./components/Main/main"
import { ScreenClassProvider } from 'react-grid-system'
import { setConfiguration } from 'react-grid-system'


setConfiguration({ maxScreenClass: 'xl' });

function App() {
  return (
      <ScreenClassProvider>
        <Main></Main>
      </ScreenClassProvider>
  );
}

export default App;
