import React from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import TodoApp from "./components/TodoApp/TodoApp/TodoApp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/todo" element={<TodoApp />} />
      </Routes>
    </Router>
  );
};

export default App;
