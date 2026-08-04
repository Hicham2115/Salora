<?php

namespace App\Http\Controllers;

use App\Models\PortfolioImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function createPortfolioImage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'img' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = $request->file('img')->store('portfolio_images', 'public');

        $portfolioImage = PortfolioImage::create([
            'name' => $validated['name'] ?? 'New photo',
            'image_path' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'data' => $portfolioImage,
        ], 201);
    }

    public function portfolioImagesData()
    {
        return response()->json(PortfolioImage::orderByDesc('id')->get());
    }

    public function updatePortfolioImage(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:portfolio_images,id',
            'name' => 'required|string|max:255',
        ]);

        $portfolioImage = PortfolioImage::findOrFail($validated['id']);
        $portfolioImage->update(['name' => $validated['name']]);

        return response()->json([
            'message' => 'Photo updated successfully',
            'data' => $portfolioImage,
        ]);
    }

    public function deletePortfolioImage(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:portfolio_images,id',
        ]);

        $portfolioImage = PortfolioImage::findOrFail($request->id);
        Storage::disk('public')->delete($portfolioImage->image_path);
        $portfolioImage->delete();

        return response()->json(['message' => 'Photo deleted successfully']);
    }
}
