"use client";
import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthContext } from "./_context/AuthContext";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function Provider({ children }) {
  // Mock user data for development without auth
  const [user, setUser] = useState({
    _id: "mock-user-id",
    name: "Demo User",
    email: "demo@example.com",
    pictureURL: "",
    credits: 10
  });

  return (
    <AuthContext.Provider value={{ user }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

export default Provider;