<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTributeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'uploader_name' => ['required', 'string', 'max:255'],
            'special_relations' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'max:4096'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
