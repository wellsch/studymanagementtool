import React, { useState, type ReactNode } from "react";
import { UserContext } from "./UserContext";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  return (
    <UserContext.Provider
      value={{ username, email, id, setUsername, setEmail, setId }}
    >
      {children}
    </UserContext.Provider>
  );
};
