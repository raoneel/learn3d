import { addConsoleMessage, clearConsole } from "./consoleActions";

export enum ActionKeys {
  ADD_CONSOLE_MESSAGE = "ADD_CONSOLE_MESSAGE",
  CLEAR_CONSOLE = "CLEAR_CONSOLE"
}

export type AllActions = ReturnType<typeof addConsoleMessage> | ReturnType<typeof clearConsole>;