import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from './Pages/Top';
import CreateRoom from './Pages/CreateRoom';
import Main from './Pages/Main';

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route index element={<Top />} />
        <Route path="CreateRoom" element={<CreateRoom />} />
        <Route path="Main" element={<Main/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
