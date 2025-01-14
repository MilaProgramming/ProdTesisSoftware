import { createContext, useState, useEffect } from "react";

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener el rol del usuario, por ejemplo, desde el localStorage
    const storedUser = JSON.parse(localStorage.getItem("session"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("session", JSON.stringify(user));
  }, [user]);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
