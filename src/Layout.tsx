import { ThemeProvider } from "next-themes"
import Navbar from "./Navbar"

export default function Layout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navbar />
    </ThemeProvider>
  )
}