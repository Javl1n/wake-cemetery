<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeceasedObituaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['member']);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $hasExistingImage = $this->route('deceased')?->obituary?->image;

        return [
            'template' => ['required', 'integer', 'in:1,2,3,4'],
            'image' => [$hasExistingImage ? 'nullable' : 'required', 'image', 'max:4096'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
