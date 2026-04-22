import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import MemberLayout from '@/layouts/member-layout';
import type { TributeDeceased, TributeObituary } from '@/types/tribute';
import { format } from 'date-fns';
import { CheckCircle2, ImageIcon, Heart, CalendarDays, User, Cross } from 'lucide-react';

interface Props {
    deceased: TributeDeceased & { id: number };
    obituary: TributeObituary | null;
}

const TEMPLATES = [
    { id: 1, name: 'Classic', description: 'Hero image, serif font, centered layout.' },
    { id: 2, name: 'Modern', description: 'Side-by-side photo and info, clean minimal.' },
    { id: 3, name: 'Newspaper', description: 'Formal masthead, print-inspired, grayscale.' },
    { id: 4, name: 'Soft', description: 'Warm rose tones, circular portrait, gentle.' },
];

interface PreviewProps {
    name: string;
    relationship: string;
    dod: string;
    description: string;
    imageUrl: string | null;
}

function ClassicPreview({ name, relationship, dod, description, imageUrl }: PreviewProps) {
    return (
        <div className="w-full font-serif bg-stone-50 text-sm leading-snug select-none pointer-events-none">
            {/* Hero */}
            <div className="relative h-44 bg-stone-300 overflow-hidden">
                {imageUrl && (
                    <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-center text-white">
                    <p className="text-[10px] uppercase tracking-widest text-stone-300 mb-1">In Loving Memory</p>
                    <p className="font-bold text-lg truncate">{name}</p>
                    <p className="text-xs text-stone-300 mt-0.5">{relationship} · {dod}</p>
                </div>
            </div>
            {/* Body */}
            <div className="p-5 space-y-4">
                {description && (
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <span className="h-px w-8 bg-stone-300" />
                            <Heart className="h-3 w-3 text-stone-400" />
                            <span className="h-px w-8 bg-stone-300" />
                        </div>
                        <p className="text-stone-500 italic text-xs line-clamp-3">"{description}"</p>
                    </div>
                )}
                <div>
                    <p className="font-bold text-stone-700 text-center text-sm mb-2">Tributes & Memories</p>
                    <div className="grid grid-cols-1 gap-2">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="rounded bg-stone-200 h-14" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModernPreview({ name, relationship, dod, description, imageUrl }: PreviewProps) {
    return (
        <div className="w-full bg-white text-sm leading-snug select-none pointer-events-none">
            <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700" />
            <div className="p-5 space-y-5">
                {/* Profile row */}
                <div className="flex gap-4">
                    {imageUrl ? (
                        <img src={imageUrl} alt="" className="h-28 w-20 object-cover rounded-xl shrink-0" />
                    ) : (
                        <div className="h-28 w-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="h-8 w-8 text-slate-300" />
                        </div>
                    )}
                    <div className="min-w-0 space-y-1 pt-1">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400">In Loving Memory</p>
                        <p className="font-bold text-lg text-slate-900 truncate">{name}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />{relationship}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />{dod}
                            </span>
                        </div>
                        {description && (
                            <p className="text-xs text-slate-500 line-clamp-3 mt-1">{description}</p>
                        )}
                    </div>
                </div>
                {/* Tributes */}
                <div>
                    <p className="font-bold text-slate-700 mb-2">Tributes</p>
                    <div className="grid grid-cols-1 gap-2">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="h-12 rounded-lg bg-slate-100 border border-slate-100" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NewspaperPreview({ name, relationship, dod, description, imageUrl }: PreviewProps) {
    return (
        <div className="w-full font-serif bg-zinc-50 text-sm leading-snug select-none pointer-events-none">
            {/* Masthead */}
            <div className="bg-zinc-900 text-white text-center py-4 px-4 space-y-1">
                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400">Obituary Notice</p>
                <p className="font-bold text-base truncate">{name}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{relationship} · {dod}</p>
            </div>
            {/* Body */}
            <div className="p-4 flex gap-3">
                {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-16 h-20 object-cover shrink-0 grayscale rounded" />
                ) : (
                    <div className="w-16 h-20 bg-zinc-200 rounded shrink-0" />
                )}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="border-l-2 border-zinc-300 pl-2">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Cause of Passing</p>
                        <p className="text-xs text-zinc-600 italic mt-0.5">Natural causes</p>
                    </div>
                    {description && (
                        <p className="text-xs text-zinc-700 line-clamp-3">{description}</p>
                    )}
                </div>
            </div>
            <div className="px-4 pb-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">— Survived by —</p>
                <p className="font-semibold text-sm text-zinc-800 mt-1">{name}</p>
            </div>
        </div>
    );
}

function SoftPreview({ name, relationship, dod, description, imageUrl }: PreviewProps) {
    return (
        <div className="w-full bg-rose-50 text-sm leading-snug select-none pointer-events-none">
            <div className="h-1 w-full bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200" />
            <div className="p-5 space-y-4 text-center">
                {/* Portrait */}
                <div className="mx-auto w-fit">
                    <div className="p-1 rounded-full bg-gradient-to-br from-rose-200 via-pink-200 to-rose-300">
                        {imageUrl ? (
                            <img src={imageUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                            <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center">
                                <User className="h-8 w-8 text-rose-300" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-widest text-rose-400">In Loving Memory</p>
                    <p className="font-bold text-rose-900 truncate">{name}</p>
                    <p className="text-xs text-rose-400 capitalize">{relationship}</p>
                </div>
                <div className="inline-block rounded-xl bg-white border border-rose-100 px-4 py-2 text-xs space-y-0.5">
                    <p className="text-rose-400 uppercase tracking-widest text-[9px]">Passed Away</p>
                    <p className="font-semibold text-rose-700">{dod}</p>
                </div>
                {description && (
                    <p className="text-xs text-rose-700 italic line-clamp-3">&ldquo;{description}&rdquo;</p>
                )}
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-rose-200 via-pink-300 to-rose-200" />
        </div>
    );
}

export default function ObituarySetup({ deceased, obituary }: Props) {
    const [selectedTemplate, setSelectedTemplate] = useState<number>(obituary?.template ?? 1);

    const { data, setData, post, processing, errors } = useForm<{
        template: number;
        image: File | null;
        description: string;
    }>({
        template: obituary?.template ?? 1,
        image: null,
        description: obituary?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/member/deceased/${deceased.id}/obituary`, { forceFormData: true });
    };

    const handleTemplateSelect = (id: number) => {
        setSelectedTemplate(id);
        setData('template', id);
    };

    const imageUrl = data.image
        ? URL.createObjectURL(data.image)
        : obituary?.image
          ? `/storage/${obituary.image}`
          : null;

    const previewProps: PreviewProps = {
        name: deceased.beneficiary.name,
        relationship: deceased.beneficiary.relationship,
        dod: format(new Date(deceased.date_of_death), 'MMM d, yyyy'),
        description: data.description,
        imageUrl,
    };

    return (
        <MemberLayout title="Create Tribute Page">
            <Head title="Create Tribute Page" />

            <div className="py-8 px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create Tribute Page</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        For <span className="font-medium text-foreground">{deceased.beneficiary.name}</span>
                        {' · '}Passed {format(new Date(deceased.date_of_death), 'MMMM d, yyyy')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left — form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Template picker */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Choose a Template</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {TEMPLATES.map((tpl) => (
                                    <button
                                        key={tpl.id}
                                        type="button"
                                        onClick={() => handleTemplateSelect(tpl.id)}
                                        className={cn(
                                            'relative rounded-xl border-2 p-3 text-left transition-all',
                                            selectedTemplate === tpl.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-muted-foreground/40',
                                        )}
                                    >
                                        {selectedTemplate === tpl.id && (
                                            <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                                        )}
                                        <p className="font-semibold text-sm">{tpl.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{tpl.description}</p>
                                    </button>
                                ))}
                            </div>
                            {errors.template && <p className="text-xs text-destructive">{errors.template}</p>}
                        </div>

                        {/* Cover photo */}
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-base font-semibold">
                                Cover Photo{' '}
                                {obituary?.image && (
                                    <span className="text-muted-foreground font-normal text-sm">
                                        (leave blank to keep current)
                                    </span>
                                )}
                            </Label>
                            <label
                                htmlFor="image"
                                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                        <ImageIcon className="h-8 w-8" />
                                        <span className="text-sm">Click to upload photo</span>
                                        <span className="text-xs">JPG, PNG up to 4MB</span>
                                    </div>
                                )}
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                />
                            </label>
                            {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-base font-semibold">
                                Memorial Message{' '}
                                <span className="text-muted-foreground font-normal text-sm">(optional)</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Share a few words in memory of your loved one…"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                            />
                            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full">
                            {obituary ? 'Update Tribute Page' : 'Publish Tribute Page'}
                        </Button>
                    </form>

                    {/* Right — live preview */}
                    <div className="lg:sticky lg:top-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                            Preview
                        </p>
                        <div className="rounded-xl border overflow-hidden shadow-sm">
                            {selectedTemplate === 1 && <ClassicPreview {...previewProps} />}
                            {selectedTemplate === 2 && <ModernPreview {...previewProps} />}
                            {selectedTemplate === 3 && <NewspaperPreview {...previewProps} />}
                            {selectedTemplate === 4 && <SoftPreview {...previewProps} />}
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            Updates as you fill in the form
                        </p>
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
