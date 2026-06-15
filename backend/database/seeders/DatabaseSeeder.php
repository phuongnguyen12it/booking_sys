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

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $rooms = collect([
            ['name' => 'Focus Room', 'capacity' => 4],
            ['name' => 'Ocean Meeting Room', 'capacity' => 8],
            ['name' => 'Creative Studio', 'capacity' => 12],
        ])->map(fn (array $room) => Room::query()->create($room));

        Booking::query()->create([
            'room_id' => $rooms[0]->id,
            'user_name' => 'Alice Nguyen',
            'start_time' => now()->addDay()->setTime(9, 0),
            'end_time' => now()->addDay()->setTime(10, 0),
        ]);

        Booking::query()->create([
            'room_id' => $rooms[1]->id,
            'user_name' => 'Minh Tran',
            'start_time' => now()->addDay()->setTime(13, 0),
            'end_time' => now()->addDay()->setTime(14, 30),
        ]);
    }
}
