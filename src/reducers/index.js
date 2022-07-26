import { combineReducers } from "redux";
import todosReducers from "./todos";

const AllReducers = combineReducers({
  todos: todosReducers,
});

export default AllReducers;
