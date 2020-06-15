import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";

// Second argument here enables chrome extension
export const store = createStore(
  rootReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

let state = store.getState();
export type MyReduxState = typeof state;