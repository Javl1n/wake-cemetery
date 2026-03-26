import { Head, usePage, Link, router } from '@inertiajs/react';
import { Footer7 } from '@/components/footer7';
import AnimatedContent from '@/components/AnimatedContent';
import { BadgeCheck, Flower, BookOpen, Gift, Menu, X, Home, Shield, Users, FileText, LogOut, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react";
import LightRays from '@/components/LightRays';
import GlareHover from '@/components/GlareHover';
import { DesktopNav } from "@/components/desktop";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FuneralPlan = {
    id: number;
    name: string;
    description: string;
    price: number;
    features: string[];
};

type BundleOffer = {
    id: number;
    name: string;
    description: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    items: string[];
};

export default function MemberWelcome() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const funeralPlans: FuneralPlan[] = [
        {
            id: 1,
            name: "Basic Funeral",
            description: "Essential funeral services with style and dignity",
            price: 45000,
            features: ["Embalming", "Viewing Room", "Casket Selection", "Transportation"],
        },
        {
            id: 2,
            name: "Premium Funeral",
            description: "Comprehensive funeral package with extra services",
            price: 75000,
            features: ["Embalming", "Multi-day Viewing", "Premium Casket", "Full Transportation", "Catering"],
        },
        {
            id: 3,
            name: "Deluxe Funeral",
            description: "Complete luxury funeral experience with all amenities",
            price: 120000,
            features: ["Premium Embalming", "Extended Viewing", "Luxury Casket", "Full Transport", "Catering", "Live Music"],
        },
    ];

    const bundleOffers: BundleOffer[] = [
        {
            id: 1,
            name: "Complete Send-Off Bundle",
            description: "Funeral + Flowers + Obituary",
            originalPrice: 50000,
            discountedPrice: 42000,
            discount: 16,
            items: ["Basic Funeral", "Flower Arrangement", "Obituary Publication"],
        },
        {
            id: 2,
            name: "Family Tribute Bundle",
            description: "Premium Funeral + Premium Flowers + Extended Obituary",
            originalPrice: 85000,
            discountedPrice: 71500,
            discount: 16,
            items: ["Premium Funeral", "Premium Flower Tribute", "Extended Obituary", "Memorial Card"],
        },
        {
            id: 3,
            name: "Ultimate Celebration Bundle",
            description: "Deluxe Funeral + All Services + Catering",
            originalPrice: 140000,
            discountedPrice: 109000,
            discount: 22,
            items: ["Deluxe Funeral", "Premium Flowers", "Full Obituary", "Catering", "Memorial Video"],
        },
    ];

    return (
        <>
            <Head title="Member Services" />

            <div className='min-h-screen flex flex-col'>
                <header className={cn("sticky top-0 z-50 w-full border-transparent border-b", {"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
                            scroll,})}>
                    <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
                        <div className="flex items-center gap-5">
                            <a
                                className="px-3 py-2.5"
                                href="#"
                            > <img
                                src="/system/logo.png"
                                className="max-h-13"
                                alt="St. luiz Logo"
                                />
                            </a>
                                <DesktopNav />
                        </div>
                         <div className="flex items-center gap-4">
                            {/* Desktop User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="default" size="icon" className="hidden md:flex rounded-full">
                                        <User className="h-5 w-5"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
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

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </nav>
                </header>

                <main className='flex-1 overflow-hidden'>
                    <div className='flex flex-col h-screen'>
                        <div className="absolute inset-0 z-0 w-full h-full">
                            <LightRays
                                raysOrigin="top-center"
                                raysColor="#0000"
                                raysSpeed={1}
                                lightSpread={0.5}
                                rayLength={3}
                                followMouse={true}
                                mouseInfluence={0.1}
                                noiseAmount={0}
                                distortion={0}
                                pulsating={false}
                                fadeDistance={1}
                                saturation={1}
                                />
                        </div>
                        <section className="flex-1  flex flex-col mx-auto w-full max-w-5xl overflow-hidden pt-16">
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 size-full overflow-hidden"
                            >
                                <div
                                    className={cn(
                                        "absolute inset-0 isolate -z-10",
                                        "bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]"
                                    )}
                                />
                            </div>
                            <div className="relative z-10 flex max-w-2xl flex-col gap-5 px-4">
                                <a
                                    className={cn(
                                        "group flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow-xs",
                                        "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
                                    )}
                                    href="#link"
                                >
                                    <div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
                                        <p className="font-mono text-xs">NOW</p>
                                    </div>

                                    <span className="text-xs">Choose Your Plan</span>
                                    <span className="block h-5 border-l" />

                                    <div className="pr-1">
                                        <ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
                                    </div>
                                </a>

                                <h1
                                    className={cn(
                                        "text-balance font-medium text-4xl text-foreground leading-tight md:text-5xl",
                                        "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out"
                                    )}
                                >
                                    Welcome, {auth.user.name}!
                                </h1>

                                <p
                                    className={cn(
                                        "text-muted-foreground text-sm tracking-wider sm:text-lg md:text-xl",
                                        "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out"
                                    )}
                                >
                                    Explore our exclusive membership benefits and find the perfect plan for you and your loved ones.
                                </p>
                            </div>
                        </section>
                    </div>
                    <AnimatedContent
                        className="container mx-auto py-12"
                        direction="vertical"
                        distance={50}
                        duration={2}
                        ease="power2.out"
                    >
                        <section className="sticky top-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex flex-col items-center justify-center gap-8 z-40">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-2">Funeral Plan Recommendation</h2>
                                <p className="text-muted-foreground">Choose the perfect plan for your family's needs</p>
                                <span className="block h-1 w-24 bg-primary mx-auto mt-4"></span>
                            </div>

                            <div className='flex w-full flex-col items-center justify-center gap-5 lg:flex-row overflow-x-auto'>
                                {funeralPlans.map((plan) => (
                                    <GlareHover
                                        key={plan.id}
                                        glareColor="#ffffff"
                                        glareOpacity={0.3}
                                        glareAngle={-30}
                                        glareSize={300}
                                        transitionDuration={800}
                                        playOnce={false}
                                        className='rounded-xl'

                                    >
                                        <Card className='w-full max-w-sm gap-10 h-140 flex flex-col'>
                                            <CardHeader className='gap-4 justify-center'>
                                                <CardTitle className='text-center text-xl font-semibold tracking-tight'>{plan.name}</CardTitle>
                                                <CardDescription className='text-center text-5xl font-bold'>₱{plan.price.toLocaleString()}</CardDescription>
                                                <CardDescription className='text-center text-foreground/40'>Complete Package</CardDescription>
                                            </CardHeader>
                                            <CardContent className='flex-1'>
                                                <p className='text-center mb-4 text-sm'>{plan.description}</p>
                                                <ul className='space-y-2'>
                                                    {plan.features.map((feature, idx) => (
                                                        <li key={idx} className='flex items-center gap-2'>
                                                            <BadgeCheck className='text-green-500 h-5 w-5' />
                                                            <p>{feature}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                            <CardFooter className='flex flex-col gap-2'>
                                                <Button className='w-full'>Select Plan</Button>
                                            </CardFooter>
                                        </Card>
                                    </GlareHover>
                                ))}
                            </div>
                        </section>
                        <section className='container py-20 flex flex-col items-center justify-center gap-8'>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                                    <Gift className="h-8 w-8" />
                                    Special Bundle Offers
                                </h2>
                                <p className="text-muted-foreground">Save up to 22% with our curated bundles</p>
                                <span className="block h-1 w-24 bg-primary mx-auto mt-4"></span>
                            </div>

                            <div className='flex w-full flex-col items-center justify-center gap-5 lg:flex-row overflow-x-auto'>
                                {bundleOffers.map((bundle) => (
                                    <GlareHover
                                        key={bundle.id}
                                        glareColor="#ffffff"
                                        glareOpacity={0.3}
                                        glareAngle={-30}
                                        glareSize={300}
                                        transitionDuration={800}
                                        playOnce={false}
                                        className='rounded-xl'
                                    >
                                        <Card className='w-full max-w-sm gap-10 h-130 flex flex-col'>
                                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Save {bundle.discount}%
                                            </div>
                                            <CardHeader>
                                                <CardTitle className='text-lg'>{bundle.name}</CardTitle>
                                                <CardDescription className='text-sm'>{bundle.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className='flex-1'>
                                                <div className='mb-4'>
                                                    <p className='text-xs text-muted-foreground line-through'>₱{bundle.originalPrice.toLocaleString()}</p>
                                                    <p className='text-3xl font-bold'>₱{bundle.discountedPrice.toLocaleString()}</p>
                                                </div>
                                                <ul className='space-y-1 text-sm'>
                                                    {bundle.items.map((item, idx) => (
                                                        <li key={idx} className='flex items-center gap-2'>
                                                            <BadgeCheck className='text-green-500 h-4 w-4' />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                            <CardFooter>
                                                <Button className='w-full'>Get Bundle</Button>
                                            </CardFooter>
                                        </Card>
                                    </GlareHover>
                                ))}
                            </div>
                        </section>
                        <section className='container py-20 flex flex-col items-center justify-center gap-8'>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                                    <Flower className="h-8 w-8" />
                                    Obituary & Memorial Services
                                </h2>
                                <p className="text-muted-foreground">Honor your loved ones with dignity and care</p>
                                <span className="block h-1 w-24 bg-primary mx-auto mt-4"></span>
                            </div>

                            <div className='grid w-full grid-cols-1 md:grid-cols-2 gap-6 p-2'>
                                <Card className='h-96 flex flex-col'>
                                    <CardHeader>
                                        <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                                        <CardTitle>Obituary Publication</CardTitle>
                                        <CardDescription>Publish a dignified tribute to your loved one</CardDescription>
                                    </CardHeader>
                                    <CardContent className='flex-1 space-y-3'>
                                        <div className='space-y-2'>
                                            <p className='text-sm font-medium'>Packages Available:</p>
                                            <ul className='text-sm space-y-1'>
                                                <li className='flex items-center gap-2'>
                                                    <BadgeCheck className='text-green-500 h-4 w-4' />
                                                    <span>Basic Obituary - ₱2,500</span>
                                                </li>
                                                <li className='flex items-center gap-2'>
                                                    <BadgeCheck className='text-green-500 h-4 w-4' />
                                                    <span>Extended Obituary - ₱5,000</span>
                                                </li>
                                                <li className='flex items-center gap-2'>
                                                    <BadgeCheck className='text-green-500 h-4 w-4' />
                                                    <span>Premium with Photo - ₱8,000</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className='w-full'>Order Obituary</Button>
                                    </CardFooter>
                                </Card>
                                <Card className='h-96 flex flex-col'>
                                    <CardHeader>
                                        <Flower className="h-8 w-8 text-pink-500 mb-2" />
                                        <CardTitle>Flower Arrangements</CardTitle>
                                        <CardDescription>Beautiful floral tributes for memorial services</CardDescription>
                                    </CardHeader>
                                    <CardContent className='flex-1 space-y-3'>
                                        <div className='space-y-2'>
                                            <p className='text-sm font-medium'>Popular Arrangements:</p>
                                            <ul className='text-sm space-y-1'>
                                                <li className='flex items-center gap-2'>
                                                    <BadgeCheck className='text-green-500 h-4 w-4' />
                                                    <span>Rose Garland - ₱3,500</span>
                                                </li>
                                                <li className='flex items-center gap-2'>
                                                    <BadgeCheck className='text-green-500 h-4 w-4' />
                                                    <span>Mixed Flower Spray - ₱5,500</span>
                                                </li>
                                                <li className='flex items-center gap-2'>
                                                    <BadgeCheck className='text-green-500 h-4 w-4' />
                                                    <span>Premium Wreath - ₱8,500</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className='w-full'>Order Flowers</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </section>
                    </AnimatedContent>
                </main>
                <footer className="bg-background shadow-lg">
                    <div className="mx-auto max-w-7xl px-6 py-10">
                        <Footer7 />
                    </div>
                </footer>
            </div>
        </>
    );
}
