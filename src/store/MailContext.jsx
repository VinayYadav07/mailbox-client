import { createContext, useContext, useReducer } from "react";

const MailContext = createContext();

const initialState = { mails: [], unreadCount: 0 };

const mailReducer = (state, action) => {
  switch (action.type) {
    case "SET_MAILS":
      return {
        ...state,
        mails: action.payload,
        unreadCount: action.payload.filter((mail) => !mail.receiverRead).length,
      };
    case "MARK_AS_READ":
      const updatedMails = state.mails.map((mail) =>
        mail.id === action.payload ? { ...mail, receiverRead: true } : mail,
      );
      return {
        ...state,
        mails: updatedMails,
        unreadCount: updatedMails.filter((mail) => !mail.receiverRead).length,
      };
    case "REMOVE_MAIL":
      const filteredMails = state.mails.filter(
        (mail) => mail.id !== action.payload,
      );
      return {
        ...state,
        mails: filteredMails,
        unreadCount: filteredMails.filter((mail) => !mail.receiverRead).length,
      };
    default:
      return state;
  }
};

export const MailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mailReducer, initialState);
  return (
    <MailContext.Provider value={{ state, dispatch }}>
      {children}
    </MailContext.Provider>
  );
};

export const useMailContext = () => {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error("useMailContext must be used within MailProvider");
  }
  return context;
};
