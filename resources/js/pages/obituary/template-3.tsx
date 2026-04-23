import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import type { ObituaryPageProps } from '@/types/tribute';

export default function ObituaryTemplate3({ obituary, deceased }: ObituaryPageProps) {
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`Obituary — ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-zinc-50 font-serif">

                {/* Masthead */}
                <header className="bg-zinc-900 text-white text-center py-8 px-6">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-3">
                        St. Luiz Cemetery and Wake Services
                    </p>
                    <div className="border-t border-b border-zinc-600 py-4 space-y-1">
                        <p className="text-xs uppercase tracking-widest text-zinc-400">Obituary Notice</p>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{name}</h1>
                    </div>
                    <p className="mt-4 text-zinc-400 text-sm uppercase tracking-widest">
                        {deceased.beneficiary.relationship} &mdash; Passed {dod}
                    </p>
                </header>

                <div className="mx-auto max-w-3xl px-6 py-12 space-y-12">

                    {/* Photo + intro */}
                    <div className="flex flex-col sm:flex-row gap-8">
                        {obituary.image && (
                            <div className="shrink-0 mx-auto sm:mx-0">
                                <img
                                    src={`/storage/${obituary.image}`}
                                    alt={name}
                                    className="w-44 h-56 object-cover grayscale contrast-110 rounded"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-4">
                            <div className="border-l-4 border-zinc-300 pl-4">
                                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Cause of Passing</p>
                                <p className="text-zinc-700 text-sm italic">
                                    {deceased.cause_of_death || 'Natural causes'}
                                </p>
                            </div>
                            {obituary.description && (
                                <p className="text-zinc-700 leading-relaxed text-base">
                                    {obituary.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <hr className="border-zinc-200" />

                    {/* Survived by */}
                    <section>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4 text-center">
                            &#8213; Survived by &#8213;
                        </p>
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-zinc-800">{deceased.beneficiary.name}</p>
                            <p className="text-sm text-zinc-500 capitalize mt-1">{deceased.beneficiary.relationship}</p>
                        </div>
                    </section>

                    <hr className="border-zinc-200" />
                </div>

                <footer className="text-center py-6 text-xs text-zinc-400 border-t border-zinc-200 mt-8">
                    St. Luiz Cemetery and Wake Services
                </footer>
            </div>
        </>
    );
}
