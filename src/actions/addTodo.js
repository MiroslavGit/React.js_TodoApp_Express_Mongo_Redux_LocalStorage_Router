const addTodo = (data) => {
  return {
    type: "ADD_TODO",
    payload: data,
  };
};

export { addTodo };
