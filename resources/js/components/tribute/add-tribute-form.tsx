import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon } from 'lucide-react';

interface Props {
    token: string;
}

export default function AddTributeForm({ token }: Props) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        uploader_name: string;
        special_relations: string;
        image: File | null;
        description: string;
    }>({
        uploader_name: '',
        special_relations: '',
        image: null,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/tribute/${token}/tributes`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    const handleImage = (file: File | undefined) => {
        if (!file) return;
        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="uploader_name" className="text-slate-700">Your Name</Label>
                    <Input
                        id="uploader_name"
                        value={data.uploader_name}
                        onChange={(e) => setData('uploader_name', e.target.value)}
                        placeholder="Juan dela Cruz"
                        className="text-slate-900 placeholder:text-slate-400"
                    />
                    {errors.uploader_name && <p className="text-xs text-destructive">{errors.uploader_name}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="special_relations" className="text-slate-700">Your Relation</Label>
                    <Input
                        id="special_relations"
                        value={data.special_relations}
                        onChange={(e) => setData('special_relations', e.target.value)}
                        placeholder="Friend, Colleague…"
                        className="text-slate-900 placeholder:text-slate-400"
                    />
                    {errors.special_relations && <p className="text-xs text-destructive">{errors.special_relations}</p>}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="tribute-image" className="text-slate-700">Photo</Label>
                <label
                    htmlFor="tribute-image"
                    className="flex items-center justify-center h-28 w-full rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <ImageIcon className="h-6 w-6" />
                            <span className="text-xs">Upload a photo</span>
                        </div>
                    )}
                    <input
                        id="tribute-image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImage(e.target.files?.[0])}
                    />
                </label>
                {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="tribute-description" className="text-slate-700">Message <span className="text-slate-400 font-normal">(optional)</span></Label>
                <Textarea
                    id="tribute-description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Share a memory or message…"
                    rows={3}
                    className="text-slate-900 placeholder:text-slate-400"
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                Leave a Tribute
            </Button>
        </form>
    );
}
