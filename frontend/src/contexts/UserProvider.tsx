import React, { useState, type ReactNode } from "react";
import { UserContext } from "./UserContext";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  return (
    <UserContext.Provider value={{ username, email, setUsername, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};
