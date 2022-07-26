import "./todoApp.css";
import React, { useEffect } from "react";
import AddTodoFrom from "./../AddTodoForm/AddTodoForm";
import TodoList from "./../TodoList/TodoList";
import { useNavigate } from "react-router";

const TodoApp = () => {
  const navigate = useNavigate();
  let userToken = localStorage.getItem("accessToken");

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    userToken === "" || userToken === null ? navigate("/") : navigate("/todo");
  };

  return (
    <div>
      <AddTodoFrom />
      <TodoList />
    </div>
  );
};

export default TodoApp;
