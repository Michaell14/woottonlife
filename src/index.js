import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import theme from "./theme";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import Header from "./components/Header"
import Discover from "./Discover";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import NotFound from "./NotFound";
import SignUp from "./SignUp";
import Footer from "./components/Footer";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp/>} />
            <Route component={NotFound} />
          </Routes>
        <Footer/>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
