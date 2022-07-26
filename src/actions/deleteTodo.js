const deleteTodo = (itemId) => {
  return {
    type: "DELETE_TODO",
    payload: itemId,
  };
};

export { deleteTodo };
