<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;

class SalonOwnerController extends Controller
{

    public function createSalon(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|unique:owners,salon_email',
            'phone' => 'required|string|min:10|max:20',
            'website' => 'nullable|string|url',
            'address' => 'required|string|min:5|max:255',
            'about' => 'nullable|string|min:10',
        ]);

        try {
            $owner = Owner::create([
                'salon_name' => $validated['name'],
                'salon_email' => $validated['email'],
                'salon_phone' => $validated['phone'],
                'salon_adresse' => $validated['address'],
                'salon_about' => $validated['about'],
            ]);

            return response()->json([
                'message' => 'Salon created successfully',
                'data' => $owner
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create salon',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
