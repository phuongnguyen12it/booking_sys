<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('+1 day', '+2 weeks');
        $endTime = (clone $startTime)->modify('+1 hour');

        return [
            'room_id' => Room::factory(),
            'user_name' => fake()->name(),
            'start_time' => $startTime,
            'end_time' => $endTime,
        ];
    }
}
