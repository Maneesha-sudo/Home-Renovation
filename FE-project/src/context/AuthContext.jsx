import React, { createContext, useState, useEffect, useContext } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await API.get("/api/auth/me").catch(() => null);
        if (res?.data?.user) {
  setUser(res.data.user);
} else {
  localStorage.removeItem("token");
  setUser(null);
}
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Add this named hook for easy consumption
export function useAuth() {
  return useContext(AuthContext);
}
// import React, { createContext, useState, useEffect } from "react";
// import API from "../api/axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ FIXED: Check token first, THEN fetch user
//   useEffect(() => {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       setUser(null);
//       setLoading(false);
//       return;
//     }

//     // Verify token by fetching user
//     const fetchUser = async () => {
//       try {
//         const res = await API.get("/api/auth/me").catch(() => null);
//         if (res?.data) {
//           setUser(res.data);
//         } else {
//           localStorage.removeItem("token");
//           setUser(null);
//         }
//       } catch (error) {
//         localStorage.removeItem("token");
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const login = (token, userData) => {
//     localStorage.setItem("token", token);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   const value = { user, login, logout, loading };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
