<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
            ],
        );

        $rooms = collect([
            ['name' => 'Focus Room', 'capacity' => 4],
            ['name' => 'Ocean Meeting Room', 'capacity' => 8],
            ['name' => 'Creative Studio', 'capacity' => 12],
        ])->map(fn (array $room) => Room::query()->updateOrCreate(
            ['name' => $room['name']],
            ['capacity' => $room['capacity']],
        ));

        $focusStartTime = now()->addDay()->setTime(9, 0);
        $oceanStartTime = now()->addDay()->setTime(13, 0);

        Booking::query()->updateOrCreate(
            [
                'room_id' => $rooms[0]->id,
                'user_name' => 'Alice Nguyen',
                'start_time' => $focusStartTime,
            ],
            ['end_time' => $focusStartTime->copy()->setTime(10, 0)],
        );

        Booking::query()->updateOrCreate(
            [
                'room_id' => $rooms[1]->id,
                'user_name' => 'Minh Tran',
                'start_time' => $oceanStartTime,
            ],
            ['end_time' => $oceanStartTime->copy()->setTime(14, 30)],
        );
    }
}
