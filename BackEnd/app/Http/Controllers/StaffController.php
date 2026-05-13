<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function createStaff(Request $request)
    {
        $validated = $request->validate([
            'staff_name' => 'required|string|max:255',
            'staff_role' => 'required|string|max:255',
        ]);

        try {
            $staff = Staff::create($validated);
            return response()->json([
                'message' => 'Staff member created successfully',
                'data' => $staff
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create staff member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function StaffData()
    {
        try {
            $staffData = Staff::all();
            return response()->json([
                'message' => 'Staff data retrieved successfully',
                'data' => $staffData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve staff data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteStaff(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:staff_tables,id',
        ]);

        try {
            Staff::findOrFail($validated['id'])->delete();
            return response()->json([
                'message' => 'Staff member deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete staff member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStaff(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:staff_tables,id',
            'staff_name' => 'required|string|max:255',
            'staff_role' => 'required|string|max:255',
        ]);

        try {
            $staff = Staff::findOrFail($validated['id']);
            $staff->update($validated);
            return response()->json([
                'message' => 'Staff member updated successfully',
                'data' => $staff
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update staff member',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
