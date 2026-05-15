"use client"
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useState, useRef, useEffect } from "react"
import { MapPin, LocateFixed, Search, X } from "lucide-react"

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const MOROCCO_CENTER: [number, number] = [31.7917, -7.0926]

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
}

interface MapPickerProps {
  lat?: number | null
  lng?: number | null
  onChange?: (lat: number, lng: number) => void
}

function ClickHandler({
  onPick,
}: {
  onPick: (latlng: [number, number]) => void
}) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.2 })
  }, [target, map])
  return null
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const [coords, setCoords] = useState<[number, number] | null>(
    lat != null && lng != null ? [lat, lng] : null
  )
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NominatimResult[]>([])
  const [searching, setSearching] = useState(false)
  const [geoloading, setGeoloading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  // When server data arrives asynchronously, initialize marker + fly once
  useEffect(() => {
    if (!initializedRef.current && lat != null && lng != null) {
      const latlng: [number, number] = [lat, lng]
      setCoords(latlng)
      setFlyTarget(latlng)
      initializedRef.current = true
    }
  }, [lat, lng])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setResults([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function pick(latlng: [number, number]) {
    setCoords(latlng)
    onChange?.(latlng[0], latlng[1])
  }

  function handleSearch(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&accept-language=en`
        )
        setResults(await res.json())
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  function handleSelect(result: NominatimResult) {
    const latlng: [number, number] = [
      parseFloat(result.lat),
      parseFloat(result.lon),
    ]
    pick(latlng)
    setFlyTarget(latlng)
    setQuery(result.display_name)
    setResults([])
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return
    setGeoloading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ]
        pick(latlng)
        setFlyTarget(latlng)
        setGeoloading(false)
      },
      () => setGeoloading(false)
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar + geolocation button */}
      <div className="flex gap-2" ref={dropdownRef}>
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for a location…"
            className="w-full rounded-xl border border-input bg-background py-2 pr-8 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setResults([])
              }}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {(results.length > 0 || searching) && (
            <ul className="absolute top-full right-0 left-0 z-1000 mt-1 max-h-52 overflow-y-auto rounded-xl border bg-white shadow-lg">
              {searching && (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  Searching…
                </li>
              )}
              {results.map((r, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(r)}
                  className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1b4331]" />
                  <span className="line-clamp-2">{r.display_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleGeolocate}
          disabled={geoloading}
          title="Use my location"
          className="flex items-center gap-1.5 rounded-xl border border-[#1b4331] px-3 py-2 text-sm font-medium text-[#1b4331] transition hover:bg-[#1b4331] hover:text-white disabled:opacity-50"
        >
          <LocateFixed className="h-4 w-4" />
          <span className="hidden sm:inline">
            {geoloading ? "Locating…" : "My location"}
          </span>
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={MOROCCO_CENTER}
        zoom={6}
        className="h-64 w-full rounded-2xl border"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler
          onPick={(latlng) => {
            pick(latlng)
          }}
        />
        <FlyTo target={flyTarget} />
        {coords && <Marker position={coords} icon={defaultIcon} />}
      </MapContainer>

      {/* {coords ? (
        <p className="text-muted-foreground text-xs">
          Pinned — Lat: <span className="font-medium text-[#1b4331]">{coords[0].toFixed(6)}</span>,{" "}
          Lng: <span className="font-medium text-[#1b4331]">{coords[1].toFixed(6)}</span>
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">
          Search, use GPS, or click the map to pin your salon location.
        </p>
      )} */}
    </div>
  )
}
