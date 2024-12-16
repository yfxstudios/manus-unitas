import { Poppins } from "next/font/google";
import "./globals.css";



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import Script from "next/script";
import Providers from "./providers";
import { cn } from "@/lib/utils";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVEsonflD_dSqM8IGdX1Gvv62KqDZ2C0I",
  authDomain: "manus-unitas.firebaseapp.com",
  projectId: "manus-unitas",
  storageBucket: "manus-unitas.appspot.com",
  messagingSenderId: "1089294401120",
  appId: "1:1089294401120:web:389914e4c4fb9d7abc4d05",
  measurementId: "G-1845XX0KGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Manus Unitas | Volunteer Management Software",
  description: "Volunteer management made easy. Manage your volunteers, events, and more with Manus Unitas."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-1845XX0KGQ"></Script>

      <Script id="analytics">
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-1845XX0KGQ');
          `
        }

      </Script>
      <body className={poppins.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html >
  );
}
