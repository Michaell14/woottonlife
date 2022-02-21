import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import Header from "./components/Header"
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Discover from "./Discover";
import Dashboard from "./Dashboard";

ReactDOM.render(
  
  <ChakraProvider>
    
    <React.StrictMode>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
