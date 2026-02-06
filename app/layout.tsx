import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
import NavbarMenu from "@/components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarMenu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
// Testing git commits and pulls
