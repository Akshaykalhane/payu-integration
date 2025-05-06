import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Pay from "./pages/Pay";
import Status from "./pages/Status";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pay />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}
