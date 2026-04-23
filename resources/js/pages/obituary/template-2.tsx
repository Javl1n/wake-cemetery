import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import type { ObituaryPageProps } from '@/types/tribute';
import { CalendarDays, User, Cross } from 'lucide-react';

export default function ObituaryTemplate2({ obituary, deceased }: ObituaryPageProps) {
    const name = deceased.beneficiary.name;
    const dod = format(new Date(deceased.date_of_death), 'MMMM d, yyyy');

    return (
        <>
            <Head title={`Obituary — ${name}`} />

            <div className="[color-scheme:light] [--background:oklch(0.9711_0.0074_80.7211)] [--foreground:oklch(0.3000_0.0358_30.2042)] [--card:oklch(0.9711_0.0074_80.7211)] [--card-foreground:oklch(0.3000_0.0358_30.2042)] [--muted:oklch(0.9370_0.0142_74.4218)] [--muted-foreground:oklch(0.4495_0.0486_39.2110)] [--border:oklch(0.8805_0.0208_74.6428)] [--input:oklch(0.8805_0.0208_74.6428)] [--primary:oklch(0.5234_0.1347_144.1672)] [--primary-foreground:oklch(1_0_0)] [--ring:oklch(0.5234_0.1347_144.1672)] min-h-screen bg-white overflow-x-hidden">

                {/* Top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700" />

                <div className="mx-auto max-w-3xl px-6 py-14 space-y-14">

                    {/* Profile section */}
                    <section className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
                        <div className="shrink-0">
                            {obituary.image ? (
                                <img
                                    src={`/storage/${obituary.image}`}
                                    alt={name}
                                    className="h-64 w-52 object-cover rounded-2xl shadow-lg"
                                />
                            ) : (
                                <div className="h-64 w-52 rounded-2xl bg-slate-100 flex items-center justify-center shadow-lg">
                                    <User className="h-20 w-20 text-slate-300" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left space-y-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-2">
                                    Obituary
                                </p>
                                <h1 className="text-4xl font-bold text-slate-900 leading-tight break-words">
                                    {name}
                                </h1>
                                <p className="text-slate-500 mt-1 capitalize">{deceased.beneficiary.relationship}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-sm text-slate-500">
                                <span className="flex items-center gap-2">
                                    <Cross className="h-3.5 w-3.5 text-slate-400" />
                                    Passed away
                                </span>
                                <span className="flex items-center gap-2 font-medium text-slate-700">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {dod}
                                </span>
                            </div>

                            {deceased.cause_of_death && (
                                <p className="text-sm text-slate-400 italic">{deceased.cause_of_death}</p>
                            )}
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* Memorial message */}
                    {obituary.description && (
                        <section className="max-w-xl mx-auto text-center space-y-3">
                            <p className="text-xs uppercase tracking-widest text-slate-400">In Memory</p>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                {obituary.description}
                            </p>
                        </section>
                    )}

                    {/* Survived by */}
                    <section className="rounded-2xl border border-slate-100 bg-slate-50 p-8">
                        <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Survived by</p>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{deceased.beneficiary.name}</p>
                                <p className="text-sm text-slate-400 capitalize">{deceased.beneficiary.relationship}</p>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="text-center py-6 text-xs text-slate-300 border-t border-slate-100 mt-8">
                    St. Luiz Cemetery and Wake Services
                </footer>
            </div>
        </>
    );
}
