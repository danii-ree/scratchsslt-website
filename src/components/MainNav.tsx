
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Book, Home, PenSquare, Library, User } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon: Icon, label, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
        active 
          ? "bg-osslt-purple text-white font-medium" 
          : "hover:bg-osslt-purple/10 text-osslt-dark-gray"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

interface MainNavProps {
  className?: string;
  currentPath: string;
}

export function MainNav({ className, currentPath }: MainNavProps) {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/practice", icon: PenSquare, label: "Practice" },
    { to: "/library", icon: Library, label: "Library" },
    { to: "/create", icon: Book, label: "Create" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className={cn(
      "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-osslt-yellow rounded-full px-4 py-2 shadow-lg animate-float",
      className
    )}>
      <div className="flex items-center space-x-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.to}
          />
        ))}
      </div>
    </nav>
  );
}
