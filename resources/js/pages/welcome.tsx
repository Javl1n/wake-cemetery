import { Head, usePage } from '@inertiajs/react';
import { Navbar5 } from '@/components/navbar5';
import { Hero } from '@/components/background-pattern2';
import { Footer7 } from '@/components/footer7';
import AnimatedContent from '@/components/AnimatedContent';
import { BadgeCheck } from "lucide-react";
import { Button } from '@/components/ui/button';
import GlareHover from '@/components/GlareHover';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MembershipComparisonTable } from '@/components/MembershipComparisonTable';


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
                        <Hero className="inset-0" />
                    </section>

                    <AnimatedContent
                        className="container mx-auto py-12"
                        direction="vertical"
                        distance={50}
                        duration={2}
                        ease="power2.out"
                    >
                        <section id="next-section" className="container py-28 md:py-24 flex flex-col items-center justify-center gap-8 lg:gap-15">
                            <h1 className="text-3xl font-bold text-center relative inline-block">
                                Membership Plans
                                <span className="block h-1 w-100 bg-primary mx-auto mt-2"></span>
                            </h1>

                            <div className='flex w-full flex-col items-center justify-center gap-5 lg:flex-row overflow-x-auto'>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <GlareHover
                                        key={i}
                                        glareColor="#ffffff"
                                        glareOpacity={0.3}
                                        glareAngle={-30}
                                        glareSize={300}
                                        transitionDuration={800}
                                        playOnce={false}
                                    >
                                        <Card className='w-full max-w-sm gap-10'>
                                            <CardHeader className='gap-4 justify-center'>
                                                <CardTitle className='text-center text-xl font-semibold tracking-tight'>Monthly</CardTitle>
                                                <CardDescription className='text-center text-6xl font-bold'>$78</CardDescription>
                                                <CardDescription className='text-center text-foreground/40'>per month</CardDescription>
                                                <Button variant="default" size="lg" className='w-70 h-11 font-mono hover:bg-primary/80 font-semibold text-background cursor-pointer rounded-2xl'>
                                                    Start Monthly
                                                </Button>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className='mt-1'>
                                                    <li className='mb-2 text-xs font-medium uppercase text-foreground/40'>Whats Included:</li>
                                                    <div className='ml-4'>
                                                        {Array.from({ length: 5 }).map((_, j) => (
                                                            <li key={j} className='flex items-center w-full justify-between mt-5'>
                                                                <div className='flex items-center gap-3 w-full'>
                                                                    <BadgeCheck className='text-green-500' />
                                                                    <p>Access to exclusive content</p>
                                                                </div>
                                                                <div className='w-5 h-5 rounded-full flex items-center justify-center'>
                                                                    <p className='text-sm'>23</p>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </div>
                                                </ul>
                                            </CardContent>
                                            <CardFooter />
                                        </Card>
                                    </GlareHover>
                                ))}
                            </div>
                        </section>
                        {/* Comparison Table */}
                        <section className='w-full h-full relative mt-20'>
                            <h2 className='text-2xl font-bold text-center'>Membership Plan Benefits</h2>
                            <span className="block h-1 w-100 bg-primary mx-auto mt-2 mb-10"></span>
                            <MembershipComparisonTable />
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
