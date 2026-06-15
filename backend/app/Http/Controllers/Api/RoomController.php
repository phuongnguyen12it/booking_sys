<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use App\Repositories\BookingRepository;
use App\Repositories\RoomRepository;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoomController extends Controller
{
    public function __construct(
        private readonly RoomRepository $rooms,
        private readonly BookingRepository $bookings,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        return RoomResource::collection($this->rooms->all());
    }

    public function bookings(Room $room): AnonymousResourceCollection
    {
        return BookingResource::collection($this->bookings->forRoom($room));
    }
}
