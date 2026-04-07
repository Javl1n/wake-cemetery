<?php

namespace App\Http\Requests;

use App\Models\WakeSchedule;
use Illuminate\Foundation\Http\FormRequest;

class StoreWakeScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', WakeSchedule::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'deceased_id' => 'required|exists:deceaseds,id',
            'room_id' => 'required|exists:wake_rooms,id',
            'package_id' => 'required|exists:wake_packages,id',
            'date_start' => 'required|date|after_or_equal:today',
            'date_end' => 'required|date|after_or_equal:date_start',
            'notes' => 'nullable|string',
            'services' => 'nullable|array',
            'services.*.id' => 'required|exists:wake_services,id',
            'services.*.fee' => 'nullable|numeric|min:0',
            'inventory_items' => 'nullable|array',
            'inventory_items.*.id' => 'required|exists:inventory_items,id',
            'inventory_items.*.quantity' => 'required|integer|min:1',
            'inventory_items.*.notes' => 'nullable|string',
            'create_claim' => 'boolean',
            'subscription_id' => 'required_if:create_claim,true|exists:subscriptions,id',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->room_id && $this->date_start && $this->date_end) {
                $conflicts = WakeSchedule::conflictingWith(
                    $this->room_id,
                    $this->date_start,
                    $this->date_end
                )->count();

                if ($conflicts > 0) {
                    $validator->errors()->add('room_id', 'This room is already booked for the selected dates.');
                }
            }
        });
    }
}
