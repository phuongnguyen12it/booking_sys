<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_issues_an_api_token_for_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/auth/token', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.email', 'admin@example.com')
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user' => ['id', 'name', 'email'],
                ],
            ]);
    }

    public function test_it_rejects_invalid_token_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/auth/token', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_it_lists_rooms(): void
    {
        Room::factory()->create([
            'name' => 'Focus Room',
            'capacity' => 4,
        ]);

        $this->getJson('/api/rooms')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Focus Room')
            ->assertJsonPath('data.0.capacity', 4);
    }

    public function test_it_lists_bookings_for_a_room(): void
    {
        $room = Room::factory()->create();
        $otherRoom = Room::factory()->create();

        $booking = Booking::factory()->create([
            'room_id' => $room->id,
            'user_name' => 'Alice Nguyen',
            'start_time' => '2026-06-16 09:00:00',
            'end_time' => '2026-06-16 10:00:00',
        ]);

        Booking::factory()->create([
            'room_id' => $otherRoom->id,
            'start_time' => '2026-06-16 09:30:00',
            'end_time' => '2026-06-16 10:30:00',
        ]);

        $this->getJson("/api/rooms/{$room->id}/bookings")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $booking->id)
            ->assertJsonPath('data.0.user_name', 'Alice Nguyen');
    }

    public function test_it_creates_a_booking(): void
    {
        $this->authenticate();

        $room = Room::factory()->create();

        $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Valid User',
            'start_time' => '2026-06-17 11:00:00',
            'end_time' => '2026-06-17 12:00:00',
        ])
            ->assertCreated()
            ->assertJsonPath('data.user_name', 'Valid User')
            ->assertJsonPath('data.room_id', $room->id);

        $this->assertDatabaseHas('bookings', [
            'room_id' => $room->id,
            'user_name' => 'Valid User',
        ]);
    }

    public function test_it_rejects_overlapping_booking_for_the_same_room(): void
    {
        $this->authenticate();

        $room = Room::factory()->create();

        Booking::factory()->create([
            'room_id' => $room->id,
            'start_time' => '2026-06-16 09:00:00',
            'end_time' => '2026-06-16 10:00:00',
        ]);

        $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Overlap User',
            'start_time' => '2026-06-16 09:30:00',
            'end_time' => '2026-06-16 10:30:00',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('start_time');
    }

    public function test_it_allows_overlapping_time_for_different_rooms(): void
    {
        $this->authenticate();

        $room = Room::factory()->create();
        $otherRoom = Room::factory()->create();

        Booking::factory()->create([
            'room_id' => $room->id,
            'start_time' => '2026-06-16 09:00:00',
            'end_time' => '2026-06-16 10:00:00',
        ]);

        $this->postJson('/api/bookings', [
            'room_id' => $otherRoom->id,
            'user_name' => 'Other Room User',
            'start_time' => '2026-06-16 09:30:00',
            'end_time' => '2026-06-16 10:30:00',
        ])
            ->assertCreated()
            ->assertJsonPath('data.room_id', $otherRoom->id);
    }

    public function test_it_rejects_booking_when_start_time_is_not_before_end_time(): void
    {
        $this->authenticate();

        $room = Room::factory()->create();

        $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Invalid Time User',
            'start_time' => '2026-06-16 10:00:00',
            'end_time' => '2026-06-16 09:00:00',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['start_time', 'end_time']);
    }

    public function test_it_rejects_booking_when_start_time_is_in_the_past(): void
    {
        $this->authenticate();

        $room = Room::factory()->create();

        $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Past Time User',
            'start_time' => now()->subHour()->format('Y-m-d H:i:s'),
            'end_time' => now()->addHour()->format('Y-m-d H:i:s'),
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('start_time');
    }

    public function test_it_deletes_a_booking(): void
    {
        $this->authenticate();

        $booking = Booking::factory()->create();

        $this->deleteJson("/api/bookings/{$booking->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('bookings', [
            'id' => $booking->id,
        ]);
    }

    public function test_it_requires_authentication_to_create_a_booking(): void
    {
        $room = Room::factory()->create();

        $this->postJson('/api/bookings', [
            'room_id' => $room->id,
            'user_name' => 'Guest User',
            'start_time' => '2026-06-17 11:00:00',
            'end_time' => '2026-06-17 12:00:00',
        ])->assertUnauthorized();
    }

    public function test_it_requires_authentication_to_delete_a_booking(): void
    {
        $booking = Booking::factory()->create();

        $this->deleteJson("/api/bookings/{$booking->id}")
            ->assertUnauthorized();
    }

    private function authenticate(): void
    {
        Sanctum::actingAs(User::factory()->create());
    }
}
