import { Head, usePage } from '@inertiajs/react';
import { Navbar5 } from '@/components/navbar5';
import { BackgroundPattern2 } from '@/components/background-pattern2';
import { Footer7 } from '@/components/footer7';
import { ProductCard1 } from '@/components/product-card1';


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
                <main className='flex-1 relative overflow-hidden'>
                    <section className='mb-2 border-b'>
                        <BackgroundPattern2 className=" inset-0" />
                    </section>
                    <section className="container mx-auto py-12">
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="min-w-xs">
                            <ProductCard1 />
                        </div>
                        ))}
                    </div>
                    </section>
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
