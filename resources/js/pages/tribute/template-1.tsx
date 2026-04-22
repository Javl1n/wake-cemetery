import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { TributePageProps, Tribute } from '@/types/tribute';
import AddTributeForm from '@/components/tribute/add-tribute-form';
import { Heart, X } from 'lucide-react';

export default function TributeTemplate1({ obituary, deceased, tributes }: TributePageProps) {
    const [lightbox, setLightbox] = useState<Tribute | null>(null);
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`In Memory of ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-stone-50 font-serif">
                {/* Hero */}
                <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-stone-300">
                    {obituary.image && (
                        <img
                            src={`/storage/${obituary.image}`}
                            alt={name}
                            className="h-full w-full object-cover object-center"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white">
                        <p className="text-sm uppercase tracking-[0.3em] text-stone-300 mb-2">In Loving Memory</p>
                        <h1 className="text-4xl sm:text-5xl font-bold">{name}</h1>
                        <p className="mt-2 text-stone-300 text-sm">
                            {deceased.beneficiary.relationship} · Passed on {dod}
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl px-4 py-12 space-y-16">
                    {/* Memorial message */}
                    {obituary.description && (
                        <section className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <span className="h-px w-16 bg-stone-300" />
                                <Heart className="h-4 w-4 text-stone-400" />
                                <span className="h-px w-16 bg-stone-300" />
                            </div>
                            <p className="text-stone-600 text-lg leading-relaxed italic max-w-2xl mx-auto">
                                "{obituary.description}"
                            </p>
                        </section>
                    )}

                    {/* Tributes */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-stone-800">
                            Tributes & Memories
                        </h2>
                        {tributes.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {tributes.map((t) => (
                                    <div key={t.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200">
                                        <img
                                            src={`/storage/${t.image}`}
                                            alt={t.uploader_name}
                                            className="h-48 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setLightbox(t)}
                                        />
                                        <div className="p-4 space-y-1">
                                            <p className="font-semibold text-stone-800">{t.uploader_name}</p>
                                            <p className="text-xs text-stone-400 uppercase tracking-wide">{t.special_relations}</p>
                                            {t.description && (
                                                <p className="text-sm text-stone-600 mt-2 leading-relaxed">"{t.description}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-stone-400 text-sm py-8">
                                Be the first to leave a tribute.
                            </p>
                        )}
                    </section>

                    {/* Add tribute */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-stone-800">Leave a Tribute</h2>
                        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                            <AddTributeForm token={obituary.tribute_token} />
                        </div>
                    </section>
                </div>

                <footer className="text-center py-8 text-xs text-stone-400 border-t border-stone-200 space-y-2">
                    <div>
                        <a
                            href={`/obituary/${obituary.tribute_token}`}
                            className="text-stone-500 hover:text-stone-700 underline underline-offset-4 transition-colors"
                        >
                            View Obituary
                        </a>
                    </div>
                    <p>St. Luiz Cemetery and Wake Services</p>
                </footer>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        <X className="h-7 w-7" />
                    </button>
                    <div
                        className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={`/storage/${lightbox.image}`}
                            alt={lightbox.uploader_name}
                            className="w-full max-h-[60vh] object-cover"
                        />
                        <div className="p-5">
                            <p className="font-semibold text-stone-800">{lightbox.uploader_name}</p>
                            <p className="text-xs text-stone-400 uppercase tracking-wide">{lightbox.special_relations}</p>
                            {lightbox.description && (
                                <p className="text-sm text-stone-600 mt-2 leading-relaxed">"{lightbox.description}"</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
