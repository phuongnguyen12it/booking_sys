<?php

namespace App\Services;

use App\Models\Booking;
use App\Repositories\BookingRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function __construct(
        private readonly BookingRepository $bookings,
    ) {
    }

    /**
     * @param array{room_id:int,user_name:string,start_time:string,end_time:string} $data
     *
     * @throws ValidationException
     */
    public function create(array $data): Booking
    {
        return DB::transaction(function () use ($data): Booking {
            if ($this->bookings->hasOverlap($data['room_id'], $data['start_time'], $data['end_time'])) {
                throw ValidationException::withMessages([
                    'start_time' => 'The selected time range overlaps an existing booking for this room.',
                ]);
            }

            return $this->bookings->create($data);
        });
    }
}
