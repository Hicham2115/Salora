<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function createNotifications(Request $request)
    {
        $validated = $request->validate([
            'booking_notification'    => 'required|boolean',
            'cancelation_notification' => 'required|boolean',
            'appointement_reminder'   => 'required|boolean',
            'new_review_notification' => 'required|boolean',
            'marketing_notification'  => 'required|boolean',
        ]);

        try {
            $notif = Notifications::updateOrCreate([], $validated);

            return response()->json([
                'message' => 'Notification settings saved successfully',
                'data'    => $notif,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save notification settings',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function NotificationsData()
    {
        try {
            $notif = Notifications::first();

            if (!$notif) {
                return response()->json(['message' => 'No notification settings found'], 404);
            }

            return response()->json([
                'message' => 'Notification settings retrieved successfully',
                'data'    => $notif,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve notification settings',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'booking_notification'    => 'required|boolean',
            'cancelation_notification' => 'required|boolean',
            'appointement_reminder'   => 'required|boolean',
            'new_review_notification' => 'required|boolean',
            'marketing_notification'  => 'required|boolean',
        ]);

        try {
            $notif = Notifications::first();

            if (!$notif) {
                return response()->json(['message' => 'Notification settings not found'], 404);
            }

            $notif->update($validated);

            return response()->json([
                'message' => 'Notification settings updated successfully',
                'data'    => $notif,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update notification settings',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
