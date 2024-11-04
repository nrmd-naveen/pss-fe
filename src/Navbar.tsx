"use client"

import { Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { NavLink, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { setTheme, theme } = useTheme()
  const location = useLocation();
  const [path, setPath] = useState('/')
  useEffect(()=>{
    setPath(location.pathname)
  },[location])
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col space-y-4">
              <NavLink className="text-lg font-medium" to={"/"}>
                Home
              </NavLink>
              <NavLink className="text-lg font-medium" to={"/history"}>
                Order History
              </NavLink>
              <NavLink className="text-lg font-medium" to={"/profile"}>
                Profile
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="mr-4 hidden md:flex">
          <NavLink className="mr-6 flex items-center space-x-2" to={"/"}>
            <span className="hidden font-bold sm:inline-block">TakeMyOrder</span>
          </NavLink>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLink className={`transition-colors hover:text-foreground/80 ${path === '/' ? "text-foreground" : "text-foreground/60" }`} to={"/"}>
              Home
            </NavLink>
            <NavLink  className={`transition-colors hover:text-foreground/80 ${path === '/history' ? "text-foreground" : "text-foreground/60" }`} to={"/history"}>
              Order History
            </NavLink>
            <NavLink  className={`transition-colors hover:text-foreground/80 ${path === '/profile' ? "text-foreground" : "text-foreground/60" }`} to={"/profile"}>
              Profile
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}