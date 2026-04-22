import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import type { ObituaryPageProps } from '@/types/tribute';
import { Heart, Cross } from 'lucide-react';

export default function ObituaryTemplate1({ obituary, deceased }: ObituaryPageProps) {
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`Obituary — ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-stone-50 font-serif">

                {/* Hero */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-stone-300">
                    {obituary.image && (
                        <img
                            src={`/storage/${obituary.image}`}
                            alt={name}
                            className="h-full w-full object-cover object-center"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-300 mb-2">Obituary</p>
                        <h1 className="text-4xl sm:text-5xl font-bold">{name}</h1>
                        <p className="mt-2 text-stone-300 text-sm">{deceased.beneficiary.relationship}</p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl px-6 py-14 space-y-12">

                    {/* Date of passing */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex items-center gap-4">
                            <span className="h-px w-16 bg-stone-300" />
                            <Cross className="h-4 w-4 text-stone-400" />
                            <span className="h-px w-16 bg-stone-300" />
                        </div>
                        <p className="text-stone-500 text-sm uppercase tracking-widest">Passed Away</p>
                        <p className="text-2xl font-semibold text-stone-800">{dod}</p>
                        <p className="text-sm text-stone-500 italic">{deceased.cause_of_death}</p>
                    </div>

                    <div className="h-px bg-stone-200" />

                    {/* Memorial message */}
                    {obituary.description && (
                        <section className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <span className="h-px w-12 bg-stone-300" />
                                <Heart className="h-4 w-4 text-stone-400" />
                                <span className="h-px w-12 bg-stone-300" />
                            </div>
                            <p className="text-stone-600 text-lg leading-relaxed italic max-w-xl mx-auto">
                                "{obituary.description}"
                            </p>
                        </section>
                    )}

                    {/* Survived by */}
                    <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center space-y-3 shadow-sm">
                        <p className="text-xs uppercase tracking-widest text-stone-400">Survived by</p>
                        <p className="text-xl font-semibold text-stone-800">{deceased.beneficiary.name}</p>
                        <p className="text-stone-500 capitalize">{deceased.beneficiary.relationship}</p>
                    </section>

                    {/* Tribute link */}
                    <div className="text-center space-y-2">
                        <p className="text-sm text-stone-500">Share your memories</p>
                        <a
                            href={`/tribute/${obituary.tribute_token}`}
                            className="inline-block text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900 transition-colors"
                        >
                            Visit the Tribute Page →
                        </a>
                    </div>
                </div>

                <footer className="text-center py-8 text-xs text-stone-400 border-t border-stone-200">
                    St. Luiz Cemetery and Wake Services
                </footer>
            </div>
        </>
    );
}
