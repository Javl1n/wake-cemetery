import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { TributePageProps, Tribute } from '@/types/tribute';
import AddTributeForm from '@/components/tribute/add-tribute-form';
import { X } from 'lucide-react';

export default function TributeTemplate3({ obituary, deceased, tributes }: TributePageProps) {
    const [lightbox, setLightbox] = useState<Tribute | null>(null);
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`In Memory of ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-zinc-50 font-serif">

                {/* Masthead */}
                <header className="bg-zinc-900 text-white text-center py-8 px-6">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-3">
                        St. Luiz Cemetery and Wake Services
                    </p>
                    <div className="border-t border-b border-zinc-600 py-4 space-y-1">
                        <p className="text-xs uppercase tracking-widest text-zinc-400">Tribute Page</p>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{name}</h1>
                    </div>
                    <p className="mt-4 text-zinc-400 text-sm uppercase tracking-widest">
                        {deceased.beneficiary.relationship} &mdash; Passed {dod}
                    </p>
                </header>

                <div className="mx-auto max-w-3xl px-6 py-12 space-y-12">

                    {/* Photo + description */}
                    {(obituary.image || obituary.description) && (
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
                            {obituary.description && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-zinc-700 leading-relaxed text-base">
                                        {obituary.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <hr className="border-zinc-200" />

                    {/* Tributes */}
                    <section className="space-y-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 text-center">
                            &#8213; Tributes &amp; Memories &#8213;
                        </p>
                        {tributes.length > 0 ? (
                            <div className="space-y-4">
                                {tributes.map((t) => (
                                    <div key={t.id} className="flex gap-4 border border-zinc-200 bg-white rounded p-4">
                                        <img
                                            src={`/storage/${t.image}`}
                                            alt={t.uploader_name}
                                            className="h-20 w-16 object-cover rounded grayscale shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setLightbox(t)}
                                        />
                                        <div className="min-w-0 space-y-1">
                                            <p className="font-semibold text-zinc-800">{t.uploader_name}</p>
                                            <p className="text-xs uppercase tracking-widest text-zinc-400">{t.special_relations}</p>
                                            {t.description && (
                                                <p className="text-sm text-zinc-600 leading-relaxed italic mt-1">
                                                    &ldquo;{t.description}&rdquo;
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-zinc-400 text-sm py-8">
                                Be the first to leave a tribute.
                            </p>
                        )}
                    </section>

                    <hr className="border-zinc-200" />

                    {/* Add tribute */}
                    <section className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 text-center">
                            &#8213; Share a Memory &#8213;
                        </p>
                        <div className="border border-zinc-200 bg-white rounded p-6">
                            <AddTributeForm token={obituary.tribute_token} />
                        </div>
                    </section>
                </div>

                <footer className="text-center py-6 text-xs text-zinc-400 border-t border-zinc-200 mt-8 space-y-2">
                    <div>
                        <a
                            href={`/obituary/${obituary.tribute_token}`}
                            className="text-zinc-500 hover:text-zinc-700 underline underline-offset-4 transition-colors"
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
                            className="w-full max-h-[60vh] object-cover grayscale"
                        />
                        <div className="p-5">
                            <p className="font-semibold text-zinc-800">{lightbox.uploader_name}</p>
                            <p className="text-xs text-zinc-400 uppercase tracking-widest">{lightbox.special_relations}</p>
                            {lightbox.description && (
                                <p className="text-sm text-zinc-600 mt-2 leading-relaxed italic">"{lightbox.description}"</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
