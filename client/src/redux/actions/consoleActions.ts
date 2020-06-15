import { ActionKeys } from "./actions";

// The return types unfortunately need to be explicitly set like this
// For type narrowing in reducers
export const addConsoleMessage = (
  message: string
): { type: ActionKeys.ADD_CONSOLE_MESSAGE; message: string } => ({
  type: ActionKeys.ADD_CONSOLE_MESSAGE,
  message,
});

export const clearConsole = (): { type: ActionKeys.CLEAR_CONSOLE } => ({
  type: ActionKeys.CLEAR_CONSOLE,
});
