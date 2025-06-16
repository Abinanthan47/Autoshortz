import { Geist, Geist_Mono,DM_Sans } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from 'react-hot-toast';

const dmsans = DM_Sans({
  subsets: ["latin"],
});

export const metadata = {
  title: "VideoGen - AI Video Generator",
  description: "Create engaging short videos with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={dmsans.className}>
        <ConvexClientProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}