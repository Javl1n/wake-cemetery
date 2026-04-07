<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCemeterySectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('cemetery_section'));
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
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cemetery_sections', 'code')->ignore($this->route('cemetery_section')),
            ],
            'description' => 'nullable|string',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'total_plots' => 'required|integer|min:0',
            'available_plots' => 'required|integer|min:0',
        ];
    }
}
