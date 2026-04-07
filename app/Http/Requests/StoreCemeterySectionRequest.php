<?php

namespace App\Http\Requests;

use App\Models\CemeterySection;
use Illuminate\Foundation\Http\FormRequest;

class StoreCemeterySectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', CemeterySection::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:cemetery_sections,code',
            'description' => 'nullable|string',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'total_plots' => 'required|integer|min:0',
            'available_plots' => 'required|integer|min:0',
            'geometry' => [
                'nullable',
                'array',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        if (! isset($value['type'], $value['geometry'])) {
                            $fail('Invalid GeoJSON format');

                            return;
                        }

                        $coords = $value['geometry']['coordinates'] ?? [];
                        $type = $value['geometry']['type'] ?? null;

                        if ($type === 'Polygon' && (! isset($coords[0]) || count($coords[0]) < 4)) {
                            $fail('Polygon must have at least 3 points (4 with closure)');
                        }

                        if ($type === 'LineString' && count($coords) < 2) {
                            $fail('Line must have at least 2 points');
                        }
                    }
                },
            ],
            'geometry_type' => 'nullable|in:polygon,line',
        ];
    }
}
