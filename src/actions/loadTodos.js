const loadTodos = (todos) => {
  return {
    type: "LOAD_TODOS",
    payload: todos,
  };
};

export { loadTodos };
