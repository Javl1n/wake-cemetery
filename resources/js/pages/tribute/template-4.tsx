import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { TributePageProps, Tribute } from '@/types/tribute';
import AddTributeForm from '@/components/tribute/add-tribute-form';
import { User, X } from 'lucide-react';

export default function TributeTemplate4({ obituary, deceased, tributes }: TributePageProps) {
    const [lightbox, setLightbox] = useState<Tribute | null>(null);
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`In Memory of ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-rose-50 overflow-x-hidden">

                {/* Decorative top border */}
                <div className="h-2 w-full bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200" />

                <div className="mx-auto max-w-2xl px-6 py-14 space-y-12">

                    {/* Portrait + name */}
                    <section className="text-center space-y-6">
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

                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-16 bg-rose-200" />
                            <span className="text-rose-300 text-lg">❧</span>
                            <span className="h-px w-16 bg-rose-200" />
                        </div>

                        <div className="inline-block rounded-2xl bg-white border border-rose-100 px-8 py-4 shadow-sm space-y-1">
                            <p className="text-xs uppercase tracking-widest text-rose-400">Passed Away</p>
                            <p className="text-xl font-semibold text-rose-800">{dod}</p>
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

                    {/* Tributes */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-16 bg-rose-200" />
                            <p className="text-xs uppercase tracking-widest text-rose-400">
                                Tributes ({tributes.length})
                            </p>
                            <span className="h-px w-16 bg-rose-200" />
                        </div>
                        {tributes.length > 0 ? (
                            <div className="space-y-4">
                                {tributes.map((t) => (
                                    <div key={t.id} className="rounded-2xl bg-white border border-rose-100 p-5 shadow-sm flex gap-4">
                                        <img
                                            src={`/storage/${t.image}`}
                                            alt={t.uploader_name}
                                            className="h-16 w-16 rounded-full object-cover shrink-0 cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-rose-100"
                                            onClick={() => setLightbox(t)}
                                        />
                                        <div className="min-w-0 space-y-1">
                                            <p className="font-semibold text-rose-900">{t.uploader_name}</p>
                                            <p className="text-xs text-rose-400 capitalize">{t.special_relations}</p>
                                            {t.description && (
                                                <p className="text-sm text-rose-700 leading-relaxed italic mt-1">
                                                    &ldquo;{t.description}&rdquo;
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-rose-300 text-sm py-8">
                                Be the first to leave a tribute.
                            </p>
                        )}
                    </section>

                    {/* Add tribute */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-16 bg-rose-200" />
                            <p className="text-xs uppercase tracking-widest text-rose-400">Share a Memory</p>
                            <span className="h-px w-16 bg-rose-200" />
                        </div>
                        <div className="rounded-2xl bg-white border border-rose-100 p-6 shadow-sm">
                            <AddTributeForm token={obituary.tribute_token} />
                        </div>
                    </section>
                </div>

                {/* Decorative bottom border */}
                <div className="h-2 w-full bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200" />

                <footer className="text-center py-6 text-xs text-rose-300 space-y-2">
                    <div>
                        <a
                            href={`/obituary/${obituary.tribute_token}`}
                            className="text-rose-400 hover:text-rose-600 underline underline-offset-4 transition-colors"
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
                            <p className="font-semibold text-rose-900">{lightbox.uploader_name}</p>
                            <p className="text-xs text-rose-400 capitalize">{lightbox.special_relations}</p>
                            {lightbox.description && (
                                <p className="text-sm text-rose-700 mt-2 leading-relaxed italic">"{lightbox.description}"</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
