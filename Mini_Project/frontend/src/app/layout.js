import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
// import Navbar from '@/components/Navbar';
// import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ["latin"],
  display: 'swap'
});

export const metadata = {
  title: "LearnHub",
  description: "Best Learning School",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

