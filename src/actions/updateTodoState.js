const updateTodoState = (itemId, newState) => {
  return {
    type: "UPDATE_TODO_STATE",
    itemId: itemId,
    newState: newState,
  };
};

export { updateTodoState };
