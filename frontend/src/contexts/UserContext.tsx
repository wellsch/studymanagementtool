import { createContext } from "react";

interface UserContextType {
  username: string;
  email: string;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
}

export const UserContext = createContext<UserContextType>({
  username: "",
  email: "",
  setUsername: () => {},
  setEmail: () => {},
});
