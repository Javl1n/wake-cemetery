import { Head, usePage } from '@inertiajs/react';
import { Navbar5 } from '@/components/navbar5';
import { BackgroundPattern2 } from '@/components/background-pattern2';
import { Footer7 } from '@/components/footer7';
import { ProductCard1 } from '@/components/product-card1';
import  AnimatedContent from '@/components/AnimatedContent';
import ScrollFloat from '@/components/ScrollFloat';


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
                            duration={0.8}
                            ease="power2.out"
                        >
                    <section className="container mx-auto">
                        <h1 className='text-3xl font-bold mb-4'>Insurance Plans</h1>
                        <div className="flex gap-6 overflow-x-auto pb-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="min-w-xs">
                                    <ProductCard1 />
                                </div>
                            ))}
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
