<?php

namespace App\Http\Controllers;

use App\Models\OpeningHours;
use Illuminate\Http\Request;

class OpeningHoursController extends Controller
{
    public function createOpeningHours(Request $request)
    {
        $validated = $request->validate([
            'owner_id'  => 'required|integer|exists:owners,id',
            'monday'    => 'nullable|array',
            'tuesday'   => 'nullable|array',
            'wednesday' => 'nullable|array',
            'thursday'  => 'nullable|array',
            'friday'    => 'nullable|array',
            'saturday'  => 'nullable|array',
            'sunday'    => 'nullable|array',
        ]);

        try {
            $openingHours = OpeningHours::first();
            if (!$openingHours) {
                $openingHours = OpeningHours::create($validated);
            } else {
                $openingHours->update($validated);
            }

            return response()->json([
                'message' => 'Opening hours saved successfully',
                'data' => $openingHours
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save opening hours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateOpeningHours(Request $request)
    {
        $validated = $request->validate([
            'id'        => 'required|integer|exists:opening_hours,id',
            'monday'    => 'nullable|array',
            'tuesday'   => 'nullable|array',
            'wednesday' => 'nullable|array',
            'thursday'  => 'nullable|array',
            'friday'    => 'nullable|array',
            'saturday'  => 'nullable|array',
            'sunday'    => 'nullable|array',
        ]);

        try {
            $openingHours = OpeningHours::findOrFail($validated['id']);
            $openingHours->update($validated);

            return response()->json([
                'message' => 'Opening hours updated successfully',
                'data' => $openingHours
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update opening hours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function OpeningHoursData()
    {
        try {
            $openingHours = OpeningHours::first();
            if (!$openingHours) {
                return response()->json([
                    'message' => 'No opening hours data found'
                ], 404);
            }

            return response()->json([
                'message' => 'Opening hours data retrieved successfully',
                'data' => $openingHours
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve opening hours data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
