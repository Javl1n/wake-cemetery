import { Head, usePage } from '@inertiajs/react';
import { Navbar5 } from '@/components/navbar5';
import { BackgroundPattern2 } from '@/components/background-pattern2';
import { Footer7 } from '@/components/footer7';
import { ProductCard1 } from '@/components/product-card1';
import  AnimatedContent from '@/components/AnimatedContent';
import ScrollFloat from '@/components/ScrollFloat';
import { BadgeCheck } from "lucide-react"
import { Button  } from '@/components/ui/button';
import ElectricBorder from '@/components/ElectricBorder';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className='min-h-screen flex flex-col'>
                <header className="sticky bg-background top-0 z-50 w-full shadow-lg">
                    <div className="mx-auto max-w-7xl px-6">
                        <Navbar5 />
                    </div>
                </header>

                <main className='flex-1 overflow-hidden'>
                    <section className='w-full'>
                        <BackgroundPattern2 className=" inset-0" />
                    </section>
                        <AnimatedContent
                            className="container mx-auto py-12"
                            direction="vertical"
                            distance={50}
                            duration={2}
                            ease="power2.out"
                        >
                    <section className="container flex flex-col item-center justify-center gap-8 lg:gap-15">
                        <h1 className="text-3xl font-bold text-center relative inline-block">
                            Membership Plans
                            <span className="block h-1 w-100 bg-primary mx-auto mt-2"></span>
                        </h1>
                        <div className='flex w-full flex-col item-center justify-center gap-5 lg:flex-row overflow-x-auto'>
                            {Array.from({length: 3}).map((_, i) => (
                                <Card className='w-full max-w-sm gap-10'>
                                    <CardHeader className='gap-4'>
                                        <CardTitle className='text-center text-xl font-semibold tracking-tight'>Monthly</CardTitle>
                                        <CardDescription className='text-center text-6xl font-bold'>$78</CardDescription>
                                        <CardDescription className='text-center text-foreground/40'>per month</CardDescription>
                                    </CardHeader>
                                    <CardContent className=''>
                                        <ul className='mt-1'>
                                            <li className='mb-4 text-xs font-medium uppercase text-foreground/40'>Whats Included:</li>
                                            {Array.from({length: 5}).map((_, i) => (
                                                <li className='flex items-center gap-2 w-full justify-between font-medium mt-2'>
                                                   <p>2,000 + production</p>
                                                   <p className='text-foreground/40'> 2</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="default" size="lg" className='w-full cursor-pointer rounded-2xl'>
                                            Start Monthly
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        {/* <div className="flex gap-6 overflow-x-auto pb-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="min-w-xs">
                                    <ProductCard1 />
                                </div>
                            ))}
                        </div> */}
                    </section>
                    <section className='w-full'>

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
