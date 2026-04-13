import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Navbar5 } from '@/components/navbar5';
import { Footer7 } from '@/components/footer7';

interface Props {
    title: string;
    children: ReactNode;
}

export default function MemberLayout({ title, children }: Props) {
    return (
        <>
            <Head title={title} />

            <div className="min-h-screen flex flex-col bg-background">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="mx-auto max-w-6xl px-6">
                        <Navbar5 />
                    </div>
                </header>

                <main className="flex-1">
                    <div className="mx-auto max-w-6xl px-6 py-10">
                        {children}
                    </div>
                </main>

                <footer className="border-t">
                    <div className="mx-auto max-w-6xl px-6 py-10">
                        <Footer7 />
                    </div>
                </footer>
            </div>
        </>
    );
}
