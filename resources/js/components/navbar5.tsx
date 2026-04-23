"use client";

import { MenuIcon } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface Navbar5Props {
    className?: string;
}

const Navbar5 = ({ className }: Navbar5Props) => {
    const { url } = usePage();
    const { auth } = usePage().props;

    const isActive = (href: string) => {
        if (href === "/") {
            return url === "/";
        }
        return url.startsWith(href);
    };
    return (

        <section className={cn("py-4 px-6 w-full", className)}>
            <nav className="flex items-center justify-between gap-6">
                    <a
                        href="https://www.shadcnblocks.com"
                        className="flex items-center gap-2"
                    >
                        <img
                            src="/system/logo.png"
                            className="max-h-8"
                            alt="St. luiz Logo"
                        />
                        <span className="text-lg font-semibold text-primary tracking-tighter">
                            St. Luiz Cemetery and Wake Services
                        </span>
                    </a>
                    <NavigationMenu className="hidden lg:block w-full">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href={auth.user ? "/member/dashboard" : "/"}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        isActive("/member/dashboard") && "bg-primary text-secondary font-medium"
                                    )}
                                >
                                    Home
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/cemetery/map"
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        isActive("/cemetery/map") && "bg-primary text-secondary font-medium"
                                    )}
                                >
                                    Cemetery Map
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/member/wake-schedules"
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        isActive("/member/wake-schedules") && "bg-primary text-secondary font-medium"
                                    )}
                                >
                                    Wake Schedules
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/member/insurance"
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        isActive("/member/insurance") && "bg-primary text-secondary font-medium"
                                    )}
                                >
                                    Insurance
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            {/* <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="#"
                                    className={navigationMenuTriggerStyle()}
                                >
                                    About us
                                </NavigationMenuLink>
                            </NavigationMenuItem> */}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="hidden items-center gap-2 lg:flex">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="default" size="icon" className="rounded-full">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="" align="start">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-foreground/30">My Account</DropdownMenuLabel>
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Plan History</DropdownMenuItem>
                                        <DropdownMenuItem>Purchase History</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Account Settings</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.post('/logout')}>Log out</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button variant="secondary" size="sm" onClick={() => router.visit('/login')}>Log in</Button>
                                <Button size="sm" onClick={() => router.visit('/register')}>Get Started</Button>
                            </>
                        )}
                    </div>
                    <Sheet>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="outline" size="icon">
                                <MenuIcon className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="max-h-screen overflow-auto">
                            <SheetHeader>
                                <SheetTitle>
                                    <a
                                        href="https://www.shadcnblocks.com"
                                        className="flex items-center gap-2"
                                    >
                                        <img
                                            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                                            className="max-h-8"
                                            alt="Shadcn UI Navbar"
                                        />
                                        <span className="text-lg font-semibold tracking-tighter">
                                            Shadcnblocks.com
                                            <svg></svg>
                                        </span>
                                    </a>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col p-4">
                                <div className="flex flex-col gap-6">
                                    <a href={auth.user ? "/member/dashboard" : "/"} className={cn("font-medium", isActive("/member/dashboard") && "text-primary")}>
                                        Home
                                    </a>
                                    <a href="/cemetery/map" className={cn("font-medium", isActive("/cemetery/map") && "text-primary")}>
                                        Cemetery Map
                                    </a>
                                    <a href="/member/wake-schedules" className={cn("font-medium", isActive("/member/wake-schedules") && "text-primary")}>
                                        Wake Schedules
                                    </a>
                                    <a href="/member/insurance" className={cn("font-medium", isActive("/member/insurance") && "text-primary")}>
                                        Insurance
                                    </a>
                                </div>
                                <div className="mt-6 flex flex-col gap-4">
                                    {auth.user ? (
                                        <Button variant="outline" onClick={() => router.post('/logout')}>Log out</Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" onClick={() => router.visit('/login')}>Log in</Button>
                                            <Button onClick={() => router.visit('/register')}>Get Started</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </nav>
        </section>
    );
};

export { Navbar5 };
