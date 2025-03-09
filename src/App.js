import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClothingList from "./components/ClothingList";
import ClothingCreate from "./components/ClothingCreate";
import ClothingEdit from "./components/ClothingEdit";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <Router>
        <div>
          <ToastContainer />
          <Routes>
            <Route path="/clothings" element={<ClothingList />} />
            <Route path="/clothings/create" element={<ClothingCreate />} />
            <Route path="/clothings/edit/:id" element={<ClothingEdit />} />
            <Route path="*" element={<ClothingList />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
