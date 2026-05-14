<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function createClient(Request $request)
    {
        $validatedData = $request->validate([
            'name'        => 'required|string|max:255',
            'phone'       => 'nullable|string|max:50',
            'visits'      => 'nullable|integer|min:0',
            'last_visit'  => 'nullable|date',
            'total_spend' => 'nullable|numeric|min:0',
            'note'        => 'nullable|string',
        ]);

        $client = Client::create($validatedData);

        return response()->json(['message' => 'Client created successfully', 'client' => $client], 201);
    }

    public function clientsData()
    {
        $clients = Client::all();
        return response()->json($clients);
    }

    public function updateClient(Request $request)
    {
        $validatedData = $request->validate([
            'id'          => 'required|exists:clients,id',
            'name'        => 'sometimes|string|max:255',
            'phone'       => 'nullable|string|max:50',
            'visits'      => 'nullable|integer|min:0',
            'last_visit'  => 'nullable|date',
            'total_spend' => 'nullable|numeric|min:0',
            'note'        => 'nullable|string',
        ]);

        $client = Client::findOrFail($validatedData['id']);
        $client->update($validatedData);

        return response()->json(['message' => 'Client updated successfully', 'client' => $client]);
    }

    public function deleteClient(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:clients,id',
        ]);

        Client::findOrFail($request->id)->delete();

        return response()->json(['message' => 'Client deleted successfully']);
    }
}
