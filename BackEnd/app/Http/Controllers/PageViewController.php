<?php

namespace App\Http\Controllers;

use App\Models\PageView;

class PageViewController extends Controller
{
    public function trackPageView()
    {
        PageView::create();

        return response()->json(['message' => 'Page view recorded'], 201);
    }

    public function pageViewsData()
    {
        $count = PageView::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();

        return response()->json(['count' => $count], 200);
    }
}
