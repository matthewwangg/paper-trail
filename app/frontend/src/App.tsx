import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppRoutes from "./routes/Routes";
import { NextUIProvider } from '@nextui-org/react';

function App() {
  return (
    <div className="App">
        <NextUIProvider>
            <AppRoutes/>
        </NextUIProvider>
    </div>
  );
}

export default App;
