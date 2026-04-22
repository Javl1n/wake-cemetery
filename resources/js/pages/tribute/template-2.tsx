import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { TributePageProps, Tribute } from '@/types/tribute';
import AddTributeForm from '@/components/tribute/add-tribute-form';
import { CalendarDays, User, X } from 'lucide-react';

export default function TributeTemplate2({ obituary, deceased, tributes }: TributePageProps) {
    const [lightbox, setLightbox] = useState<Tribute | null>(null);
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`In Memory of ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-white overflow-x-hidden">
                {/* Top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700" />

                <div className="mx-auto max-w-4xl px-4 py-12 space-y-16">
                    {/* Profile section */}
                    <section className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                        <div className="shrink-0">
                            {obituary.image ? (
                                <img
                                    src={`/storage/${obituary.image}`}
                                    alt={name}
                                    className="h-52 w-44 object-cover rounded-2xl shadow-lg"
                                />
                            ) : (
                                <div className="h-52 w-44 rounded-2xl bg-slate-100 flex items-center justify-center shadow-lg">
                                    <User className="h-16 w-16 text-slate-300" />
                                </div>
                            )}
                        </div>
                        <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
                            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                                In Loving Memory
                            </p>
                            <h1 className="text-4xl font-bold text-slate-900 leading-tight break-words">{name}</h1>
                            <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    {deceased.beneficiary.relationship}
                                </span>
                                <span className="hidden sm:block text-slate-200">·</span>
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Passed {dod}
                                </span>
                            </div>
                            {obituary.description && (
                                <p className="text-slate-600 leading-relaxed max-w-lg">
                                    {obituary.description}
                                </p>
                            )}
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Tributes */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">
                                Tributes <span className="text-slate-400 font-normal text-base">({tributes.length})</span>
                            </h2>
                        </div>
                        {tributes.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {tributes.map((t) => (
                                    <div key={t.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                                        <img
                                            src={`/storage/${t.image}`}
                                            alt={t.uploader_name}
                                            className="h-16 w-16 rounded-lg object-cover shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setLightbox(t)}
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800 text-sm">{t.uploader_name}</p>
                                            <p className="text-xs text-slate-400">{t.special_relations}</p>
                                            {t.description && (
                                                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                                                    {t.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
                                No tributes yet. Be the first to share a memory.
                            </div>
                        )}
                    </section>

                    {/* Add tribute */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">Share a Memory</h2>
                        <div className="rounded-xl border border-slate-200 p-6">
                            <AddTributeForm token={obituary.tribute_token} />
                        </div>
                    </section>
                </div>

                <footer className="text-center py-6 text-xs text-slate-300 border-t border-slate-100 mt-8 space-y-2">
                    <div>
                        <a
                            href={`/obituary/${obituary.tribute_token}`}
                            className="text-slate-400 hover:text-slate-600 underline underline-offset-4 transition-colors"
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
                            <p className="font-semibold text-slate-800">{lightbox.uploader_name}</p>
                            <p className="text-xs text-slate-400">{lightbox.special_relations}</p>
                            {lightbox.description && (
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{lightbox.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
