"use client"
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Provider from "./provider";

function ConvexClientProvider({ children }) {
  // Check if the Convex URL is available
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  if (!convexUrl) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set. Please check your .env.local file.");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600 mb-4">
            Convex URL is not configured. Please ensure your .env.local file contains:
          </p>
          <code className="bg-gray-100 p-2 rounded block">
            NEXT_PUBLIC_CONVEX_URL=http://localhost:3210
          </code>
          <p className="text-sm text-gray-500 mt-4">
            Make sure to run `convex dev` in a separate terminal.
          </p>
        </div>
      </div>
    );
  }

  const convex = new ConvexReactClient(convexUrl);
  
  return (
    <div>
      <ConvexProvider client={convex}>
        <Provider>{children}</Provider>
      </ConvexProvider>
    </div>
  );
}

export default ConvexClientProvider;