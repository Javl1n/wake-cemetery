<?php

namespace App\Http\Requests;

use App\Models\CemeteryPlot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCemeteryPlotRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', CemeteryPlot::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'section_id' => 'required|exists:cemetery_sections,id',
            'deceased_id' => 'nullable|exists:deceaseds,id',
            'plot_number' => 'required|string|max:255|unique:cemetery_plots,plot_number',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'status' => ['required', Rule::in(['available', 'occupied', 'reserved', 'maintenance'])],
            'burial_date' => 'nullable|date',
            'description' => 'nullable|string',
        ];
    }
}
