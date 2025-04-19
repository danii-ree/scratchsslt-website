
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface MainNavProps {
  currentPath: string;
}

export function MainNav({ currentPath }: MainNavProps) {
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/practice", label: "Practice" },
    { path: "/library", label: "Library" },
    { path: "/create", label: "Create" },
    { path: "/profile", label: "Profile" }
  ];

  return (
    <NavigationMenu className="p-4 bg-white shadow-sm">
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <Link to={item.path}>
              <NavigationMenuLink 
                active={currentPath === item.path}
                className={navigationMenuTriggerStyle()}
              >
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        {user ? (
          <NavigationMenuItem>
            <Button 
              variant="ghost" 
              onClick={signOut}
              className="ml-4"
            >
              Log Out
            </Button>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <Link to="/auth">
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()}
              >
                Log In
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
