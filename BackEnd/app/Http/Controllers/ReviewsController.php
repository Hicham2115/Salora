<?php

namespace App\Http\Controllers;

use App\Models\Reviews;
use Illuminate\Http\Request;

class ReviewsController extends Controller
{
    public function createReview(Request $request)
    {
        $validatedData = $request->validate([
            'reviewer_name' => 'required|string|max:255',
            'review_content' => 'required|string',
            'review_stars' => 'required|integer|min:0|max:5',
        ]);

        $review = Reviews::create($validatedData);

        return response()->json(['message' => 'Review created successfully', 'review' => $review], 201);
    }

    public function ReviewsData()
    {
        $reviews = Reviews::all();
        return response()->json($reviews);
    }
}
