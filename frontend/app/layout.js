import "./globals.css";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { Inter } from "next/font/google"
import ToastManager from "@/components/custom/ToastManager";
import ClientWrapper from "@/components/custom/ClientWrapper";


const inter = Inter({ subsets: ["latin"] })


export const metadata = {
  title: `(8) Instagram`,
  description: "A social app",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastManager />
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
