<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function createBooking(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'phone'       => 'nullable|string|max:50',
            'service'     => 'required|string|max:255',
            'staff'       => 'required|string|max:255',
            'date'        => 'required|date',
            'time'        => 'required|string|max:5',
            'duration'    => 'required|integer|min:1',
            'price'       => 'required|numeric|min:0',
            'status'      => 'sometimes|in:confirmed,pending,cancelled',
            'notes'       => 'nullable|string',
        ]);

        $booking = Booking::create($validated);

        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);
    }

    public function bookingsData()
    {
        return response()->json(Booking::orderBy('date')->orderBy('time')->get());
    }

    public function updateBooking(Request $request)
    {
        $validated = $request->validate([
            'id'          => 'required|exists:bookings,id',
            'client_name' => 'sometimes|string|max:255',
            'phone'       => 'nullable|string|max:50',
            'service'     => 'sometimes|string|max:255',
            'staff'       => 'sometimes|string|max:255',
            'date'        => 'sometimes|date',
            'time'        => 'sometimes|string|max:5',
            'duration'    => 'sometimes|integer|min:1',
            'price'       => 'sometimes|numeric|min:0',
            'status'      => 'sometimes|in:confirmed,pending,cancelled',
            'notes'       => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($validated['id']);
        $booking->update($validated);

        return response()->json(['message' => 'Booking updated successfully', 'booking' => $booking]);
    }

    public function deleteBooking(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:bookings,id',
        ]);

        Booking::findOrFail($request->id)->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }
}
