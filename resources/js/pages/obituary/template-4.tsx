import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import type { ObituaryPageProps } from '@/types/tribute';
import { User } from 'lucide-react';

export default function ObituaryTemplate4({ obituary, deceased }: ObituaryPageProps) {
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`Obituary — ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-rose-50 overflow-x-hidden">

                {/* Decorative top border */}
                <div className="h-2 w-full bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200" />

                <div className="mx-auto max-w-2xl px-6 py-14 space-y-12">

                    {/* Portrait + name */}
                    <section className="text-center space-y-6">
                        {/* Decorative ring around photo */}
                        <div className="mx-auto w-fit">
                            <div className="p-1.5 rounded-full bg-gradient-to-br from-rose-200 via-pink-200 to-rose-300 shadow-lg">
                                {obituary.image ? (
                                    <img
                                        src={`/storage/${obituary.image}`}
                                        alt={name}
                                        className="h-44 w-44 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-44 w-44 rounded-full bg-rose-100 flex items-center justify-center">
                                        <User className="h-16 w-16 text-rose-300" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-rose-400">In Loving Memory</p>
                            <h1 className="text-4xl font-bold text-rose-900 leading-tight">{name}</h1>
                            <p className="text-rose-500/80 capitalize text-sm">{deceased.beneficiary.relationship}</p>
                        </div>

                        {/* Soft divider */}
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-16 bg-rose-200" />
                            <span className="text-rose-300 text-lg">❧</span>
                            <span className="h-px w-16 bg-rose-200" />
                        </div>

                        {/* Passing date */}
                        <div className="inline-block rounded-2xl bg-white border border-rose-100 px-8 py-4 shadow-sm space-y-1">
                            <p className="text-xs uppercase tracking-widest text-rose-400">Passed Away</p>
                            <p className="text-xl font-semibold text-rose-800">{dod}</p>
                            {deceased.cause_of_death && (
                                <p className="text-sm text-rose-400 italic">{deceased.cause_of_death}</p>
                            )}
                        </div>
                    </section>

                    {/* Memorial message */}
                    {obituary.description && (
                        <section className="rounded-2xl bg-white border border-rose-100 p-8 text-center shadow-sm space-y-3">
                            <p className="text-xs uppercase tracking-widest text-rose-400">A Message</p>
                            <p className="text-rose-800 leading-relaxed text-lg italic">
                                &ldquo;{obituary.description}&rdquo;
                            </p>
                        </section>
                    )}

                    {/* Survived by */}
                    <section className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-16 bg-rose-200" />
                            <p className="text-xs uppercase tracking-widest text-rose-400">Survived by</p>
                            <span className="h-px w-16 bg-rose-200" />
                        </div>
                        <div className="mx-auto w-fit rounded-2xl bg-white border border-rose-100 px-10 py-5 shadow-sm">
                            <p className="text-xl font-semibold text-rose-800">{deceased.beneficiary.name}</p>
                            <p className="text-sm text-rose-400 capitalize mt-1">{deceased.beneficiary.relationship}</p>
                        </div>
                    </section>
                </div>

                {/* Decorative bottom border */}
                <div className="h-2 w-full bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200" />

                <footer className="text-center py-6 text-xs text-rose-300">
                    St. Luiz Cemetery and Wake Services
                </footer>
            </div>
        </>
    );
}
