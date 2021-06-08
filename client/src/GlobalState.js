import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    setSocket(socket);
    return () => socket.close();
  }, []);

  const state = {
    socket,
  };

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
};
