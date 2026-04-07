<?php

namespace App\Http\Requests;

use App\Models\WakeSchedule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWakeScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('wake_schedule'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'deceased_id' => 'sometimes|required|exists:deceaseds,id',
            'room_id' => 'sometimes|required|exists:wake_rooms,id',
            'package_id' => 'sometimes|required|exists:wake_packages,id',
            'date_start' => 'sometimes|required|date',
            'date_end' => 'sometimes|required|date|after_or_equal:date_start',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:pending,confirmed,in_progress,completed,cancelled',
            'services' => 'nullable|array',
            'services.*.id' => 'required|exists:wake_services,id',
            'services.*.fee' => 'nullable|numeric|min:0',
            'services.*.status' => 'nullable|in:pending,completed',
            'inventory_items' => 'nullable|array',
            'inventory_items.*.id' => 'required|exists:inventory_items,id',
            'inventory_items.*.quantity' => 'required|integer|min:1',
            'inventory_items.*.notes' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->room_id && $this->date_start && $this->date_end) {
                $conflicts = WakeSchedule::conflictingWith(
                    $this->room_id,
                    $this->date_start,
                    $this->date_end,
                    $this->route('wake_schedule')->id
                )->count();

                if ($conflicts > 0) {
                    $validator->errors()->add('room_id', 'This room is already booked for the selected dates.');
                }
            }
        });
    }
}
