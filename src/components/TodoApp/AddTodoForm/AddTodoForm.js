import "./AddTodoForm.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "./../../../actions/addTodo";
import { useNavigate } from "react-router";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import SensorDoorTwoToneIcon from "@mui/icons-material/SensorDoorTwoTone";
import Button from "@mui/material/Button";

const AddTodoForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.length) {
      return;
    }

    fetch("http://localhost:8080/todo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        text: inputText,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(addTodo(data));
      });
    setInputText("");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<SensorDoorTwoToneIcon />}
        style={{ marginLeft: "47%", marginTop: 50, flexGrow: 1 }}
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Box
        component="form"
        className="AddTodoForm"
        Validate
        sx={{ mt: 15, mb: 3 }}
        onSubmit={handleSubmit}
      >
        <TextField
          required
          margin="normal"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          id="inputText"
          label="New todo"
          name="Todo"
          InputProps={{
            endAdornment: (
              <IconButton type="submit" variant="contained">
                <AddIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </>
  );
};

export default AddTodoForm;
