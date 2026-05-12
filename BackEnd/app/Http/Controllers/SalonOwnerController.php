<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;

class SalonOwnerController extends Controller
{

    public function createSalon(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|unique:owners,salon_email',
            'phone' => 'required|string|min:10|max:20',
            'website' => 'nullable|string|url',
            'address' => 'required|string|min:5|max:255',
            'about' => 'nullable|string|min:10',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        try {
            $logoPath = null;
            if ($request->hasFile('img')) {
                $logoPath = $request->file('img')->store('salon_logos', 'public');
            }

            $owner = Owner::create([
                'salon_name' => $validated['name'],
                'salon_email' => $validated['email'],
                'salon_phone' => $validated['phone'],
                'salon_website' => $validated['website'],
                'salon_adresse' => $validated['address'],
                'salon_about' => $validated['about'],
                'salon_logo' => $logoPath,
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

    public function SalonData()
    {
        try {
            $salonData = Owner::first();
            // dd($salonData);
            if (!$salonData) {
                return response()->json([
                    'message' => 'No salon data found'
                ], 404);
            }

            return response()->json([
                'message' => 'Salon data retrieved successfully',
                'data' => $salonData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve salon data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
