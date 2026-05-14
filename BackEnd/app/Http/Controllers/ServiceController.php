<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function createService(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'duration' => 'required|integer|min:1',
            'price'    => 'required|numeric|min:0',
        ]);

        $service = Service::create($validated);

        return response()->json(['message' => 'Service created successfully', 'service' => $service], 201);
    }

    public function servicesData()
    {
        return response()->json(Service::orderBy('category')->orderBy('name')->get());
    }

    public function updateService(Request $request)
    {
        $validated = $request->validate([
            'id'       => 'required|exists:services,id',
            'name'     => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'duration' => 'sometimes|integer|min:1',
            'price'    => 'sometimes|numeric|min:0',
        ]);

        $service = Service::findOrFail($validated['id']);
        $service->update($validated);

        return response()->json(['message' => 'Service updated successfully', 'service' => $service]);
    }

    public function deleteService(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:services,id',
        ]);

        Service::findOrFail($request->id)->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }
}
