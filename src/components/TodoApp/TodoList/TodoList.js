import "./TodoList.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadTodos } from "../../../actions/loadTodos";
import { updateTodoState } from "../../../actions/updateTodoState";
import { deleteTodo } from "../../../actions/deleteTodo";
import { useNavigate } from "react-router";

import ToggleButton from "@mui/material/ToggleButton";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const TodoList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.todos);
  const [filter, setFilter] = useState("-1");
  let notStarted = [];
  let active = [];
  let ended = [];

  console.log(items);
  console.log(filter);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    fetch("http://localhost:8080/todo", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => dispatch(loadTodos(data)))
      .catch((err) => navigate("/"));
  };

  const handleUpdate = (itemId, newState) => {
    fetch("http://localhost:8080/todo/" + itemId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        newState: newState,
      }),
    })
      .then((res) => res.json())
      .then(() => dispatch(updateTodoState(itemId, newState)))
      .catch((err) => console.error(err));
  };

  const handleDelete = (itemId) => {
    fetch("http://localhost:8080/todo/" + itemId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then(() => dispatch(deleteTodo(itemId)))
      .catch((err) => console.error(err));
  };

  const handleFilter = (e) => {
    setFilter(e.target.value === filter ? "-1" : e.target.value);
  };

  items.forEach((item) => {
    if (item.state !== parseInt(filter) && filter !== "-1") return;
    let itemClass;
    switch (item.state) {
      case 1:
        itemClass = "active";
        break;
      case 2:
        itemClass = "ended";
        break;
      default:
        itemClass = "notStarted";
    }
    const newItem = (
      <li className={"item " + itemClass} key={item.id}>
        <p>{item.text}</p>
        <div>
          {item.state === 2 && (
            <button onClick={(e) => handleUpdate(item._id, 0)}>
              not&nbsp;started
            </button>
          )}
          {item.state !== 2 && (
            <button onClick={(e) => handleUpdate(item._id, 2)}>finished</button>
          )}
          {item.state === 1 && (
            <button onClick={(e) => handleUpdate(item._id, 0)}>
              not&nbsp;started
            </button>
          )}
          {item.state !== 1 && (
            <button onClick={(e) => handleUpdate(item._id, 1)}>
              in&nbsp;progress
            </button>
          )}
          <button onClick={(e) => handleDelete(item._id)}>delete</button>
        </div>
      </li>
    );

    switch (item.state) {
      case 0:
        notStarted.push(newItem);
        break;
      case 1:
        active.push(newItem);
        break;
      case 2:
        ended.push(newItem);
        break;
      default:
        console.log("Invalid todo status");
    }
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <ToggleButtonGroup exclusive aria-label="todo filter">
          <ToggleButton value="-1" onClick={handleFilter} aria-label="All">
            All
          </ToggleButton>
          <ToggleButton
            value="0"
            onClick={handleFilter}
            aria-label="Not started"
          >
            Not started
          </ToggleButton>
          <ToggleButton
            value="1"
            onClick={handleFilter}
            aria-label="In progress"
          >
            In progress
          </ToggleButton>
          <ToggleButton value="2" onClick={handleFilter} aria-label="Finished">
            Finished
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ul className="TodoList">
        {notStarted.length > 0 && (
          <div>
            <h4>Not started</h4>
            {notStarted}
          </div>
        )}
        {active.length > 0 && (
          <div>
            <h4>In progress</h4>
            {active}
          </div>
        )}
        {ended.length > 0 && (
          <div>
            <h4>Finished</h4>
            {ended}
          </div>
        )}
      </ul>
    </>
  );
};

export default TodoList;
