import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import NavbarMenu from "@/components/navbar";
import { Footer } from "./components/footer";
import "leaflet/dist/leaflet.css";

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
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
// Testing git commits and pulls
