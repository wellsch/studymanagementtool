import { createContext } from "react";

interface UserContextType {
  username: string;
  email: string;
  id: string;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setId: (id: string) => void;
}

export const UserContext = createContext<UserContextType>({
  username: "",
  email: "",
  id: "",
  setUsername: () => {},
  setEmail: () => {},
  setId: () => {},
});
