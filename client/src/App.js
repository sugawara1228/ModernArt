import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from './Pages/Top';
import CreateRoom from './Pages/CreateRoom';
import Room from './Pages/Room';

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route index element={<Top />} />
        <Route path="createroom" element={<CreateRoom />} />
        <Route path="room/:roomId" element={<Room/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
