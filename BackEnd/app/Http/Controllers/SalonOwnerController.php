<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SalonOwnerController extends Controller
{

    public function createSalon(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|unique:owners,salon_email',
            'phone' => 'required|string|min:10|max:20',
            'website' => 'sometimes|nullable|url',
            'instagram' => 'sometimes|nullable|string|max:100',
            'address' => 'required|string|min:5|max:255',
            'about' => 'sometimes|nullable|string|min:10',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'latitude' => 'sometimes|nullable|numeric|between:-90,90',
            'longitude' => 'sometimes|nullable|numeric|between:-180,180',
            'is_open' => 'sometimes|boolean',
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
                'salon_website' => $validated['website'] ?? null,
                'salon_instagram' => $validated['instagram'] ?? null,
                'salon_adresse' => $validated['address'],
                'salon_about' => $validated['about'] ?? null,
                'salon_logo' => $logoPath,
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'is_open' => $validated['is_open'] ?? true,
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

    public function updateSalonStatus(Request $request)
    {
        $validated = $request->validate([
            'is_open' => 'present|boolean',
        ]);

        try {
            $owner = Owner::first();
            if (!$owner) {
                return response()->json(['message' => 'Salon not found'], 404);
            }
            $owner->is_open = $validated['is_open'];
            $owner->save();
            return response()->json(['message' => 'Status updated', 'is_open' => $owner->is_open], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update status', 'error' => $e->getMessage()], 500);
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

    public function updateSalon(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|unique:owners,salon_email,' . $request->id,
            'phone' => 'required|string|min:10|max:20',
            'website' => 'sometimes|nullable|url',
            'instagram' => 'sometimes|nullable|string|max:100',
            'address' => 'required|string|min:5|max:255',
            'about' => 'sometimes|nullable|string|min:10',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'latitude' => 'sometimes|nullable|numeric|between:-90,90',
            'longitude' => 'sometimes|nullable|numeric|between:-180,180',
            'is_open' => 'sometimes|boolean',
        ]);

        try {
            $owner = Owner::find($request->id);
            if (!$owner) {
                return response()->json([
                    'message' => 'Salon not found'
                ], 404);
            }

            if ($request->hasFile('img')) {
                // Delete old logo if exists
                if ($owner->salon_logo) {
                    Storage::disk('public')->delete($owner->salon_logo);
                }
                $logoPath = $request->file('img')->store('salon_logos', 'public');
                $owner->salon_logo = $logoPath;
            }

            $owner->salon_name = $validated['name'];
            $owner->salon_email = $validated['email'];
            $owner->salon_phone = $validated['phone'];
            $owner->salon_website = $validated['website'] ?? null;
            $owner->salon_instagram = $validated['instagram'] ?? null;
            $owner->salon_adresse = $validated['address'];
            $owner->salon_about = $validated['about'] ?? null;
            $owner->latitude = $validated['latitude'] ?? null;
            $owner->longitude = $validated['longitude'] ?? null;
            if (array_key_exists('is_open', $validated)) {
                $owner->is_open = $validated['is_open'];
            }
            $owner->save();

            return response()->json([
                'message' => 'Salon updated successfully',
                'data' => $owner
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update salon',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
