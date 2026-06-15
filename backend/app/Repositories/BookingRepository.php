<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;

class BookingRepository
{
    /**
     * @return Collection<int, Booking>
     */
    public function forRoom(Room $room): Collection
    {
        return $room->bookings()
            ->orderBy('start_time')
            ->get();
    }

    /**
     * @param array{room_id:int,user_name:string,start_time:string,end_time:string} $data
     */
    public function create(array $data): Booking
    {
        return Booking::query()->create($data);
    }

    public function hasOverlap(int $roomId, string $startTime, string $endTime): bool
    {
        return Booking::query()
            ->where('room_id', $roomId)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->exists();
    }
}
