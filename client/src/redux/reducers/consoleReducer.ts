import { AllActions, ActionKeys } from "../actions/actions";

interface ConsoleState {
  messages: Messages[];
}

let initialState: ConsoleState = {
  messages: []
}

// Regular, string-based message
interface RegularMessage {
  message: string;
}

// Union type of all Console Message Types
type Messages = RegularMessage;

export const consoleReducer = (state: ConsoleState = initialState, action: AllActions): ConsoleState => {
  switch (action.type) {
    case ActionKeys.ADD_CONSOLE_MESSAGE:

      let newMessage: RegularMessage = {
        message: action.message
      };

      return {
        ...state,
        messages: [...state.messages, newMessage]
      };
    case ActionKeys.CLEAR_CONSOLE:
      return {
        ...state,
        messages: []
      };
    default:
      return state;
  }
}