import { combineReducers } from "redux";
import { consoleReducer } from "./consoleReducer";


export default combineReducers({
  console: consoleReducer
});