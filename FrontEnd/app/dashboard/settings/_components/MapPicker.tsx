"use client"

import { useEffect, useRef, useState } from "react"
import { Search, LocateFixed } from "lucide-react"
import "leaflet/dist/leaflet.css"
import type L from "leaflet"

interface Props {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

const DEFAULT_LAT = 33.5731
const DEFAULT_LNG = -7.5898

const ICON_OPTIONS = {
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
}

export default function MapPicker({ lat, lng, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const LRef = useRef<typeof L | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [noResult, setNoResult] = useState(false)

  // ── Init map once ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import("leaflet").then((Leaflet) => {
      LRef.current = Leaflet

      const initLat = lat ?? DEFAULT_LAT
      const initLng = lng ?? DEFAULT_LNG
      const zoom = lat != null ? 15 : 12

      // StrictMode runs cleanup then re-mounts; Leaflet leaves _leaflet_id on
      // the DOM node even after .remove(), so we clear it before re-initializing.
      const container = containerRef.current!
      if ((container as any)._leaflet_id) {
        delete (container as any)._leaflet_id
      }

      const map = Leaflet.map(container).setView([initLat, initLng], zoom)
      mapRef.current = map

      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      const icon = Leaflet.icon(ICON_OPTIONS)

      function placeMarker(pLat: number, pLng: number) {
        if (markerRef.current) {
          markerRef.current.setLatLng([pLat, pLng])
        } else {
          markerRef.current = Leaflet.marker([pLat, pLng], { icon, draggable: true }).addTo(map)
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current!.getLatLng()
            onChangeRef.current(pos.lat, pos.lng)
          })
        }
        onChangeRef.current(pLat, pLng)
      }

      // Store placeMarker on the map instance so search/locate can call it
      ;(map as any)._placeSalonMarker = placeMarker

      if (lat != null && lng != null) {
        placeMarker(lat, lng)
      }

      map.on("click", (e: L.LeafletMouseEvent) => {
        placeMarker(e.latlng.lat, e.latlng.lng)
      })
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      markerRef.current = null
      LRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync marker when saved coords load from DB ─────────────────────
  useEffect(() => {
    if (!mapRef.current || lat == null || lng == null) return
    const place = (mapRef.current as any)._placeSalonMarker
    if (place) place(lat, lng)
    mapRef.current.setView([lat, lng], mapRef.current.getZoom())
  }, [lat, lng])

  // ── Search ─────────────────────────────────────────────────────────
  async function handleSearch() {
    if (!query.trim() || !mapRef.current) return
    setSearching(true)
    setNoResult(false)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en", "User-Agent": "Salora/1.0" } }
      )
      const data = await res.json()
      if (!data.length) { setNoResult(true); return }
      const numLat = parseFloat(data[0].lat)
      const numLng = parseFloat(data[0].lon)
      mapRef.current.setView([numLat, numLng], 16)
      ;(mapRef.current as any)._placeSalonMarker?.(numLat, numLng)
    } catch {
      setNoResult(true)
    } finally {
      setSearching(false)
    }
  }

  // ── Locate me ─────────────────────────────────────────────────────
  function locateMe() {
    if (!navigator.geolocation || !mapRef.current) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: gLat, longitude: gLng } = pos.coords
      mapRef.current!.setView([gLat, gLng], 17)
      ;(mapRef.current as any)._placeSalonMarker?.(gLat, gLng)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Search — intentionally NOT a <form> to avoid nesting inside the parent form */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setNoResult(false) }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
            placeholder="Search address or place…"
            className="w-full rounded-xl border bg-[#f2ede6] py-2.5 pr-4 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {searching ? "…" : "Search"}
        </button>
        <button
          type="button"
          onClick={locateMe}
          title="Use my current location"
          className="cursor-pointer rounded-xl border bg-white px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50"
        >
          <LocateFixed size={16} />
        </button>
      </div>

      {noResult && (
        <p className="text-xs text-red-500">No results found. Try a more specific address.</p>
      )}

      {/* Map */}
      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-2xl border"
        style={{ zIndex: 0 }}
      />

      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to set your exact location.
      </p>
    </div>
  )
}
