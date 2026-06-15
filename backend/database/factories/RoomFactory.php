<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement([
                'Focus Room',
                'Ocean Meeting Room',
                'Creative Studio',
                'Board Room',
                'Quiet Pod',
            ]),
            'capacity' => fake()->numberBetween(2, 12),
        ];
    }
}
