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

const MOROCCO_CENTER = [31.7917, -7.0926]

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.2 })
  }, [target, map])
  return null
}

export default function MapPicker({ lat, lng, onChange }) {
  const [coords, setCoords] = useState(
    lat != null && lng != null ? [lat, lng] : null
  )
  const [flyTarget, setFlyTarget] = useState(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [geoloading, setGeoloading] = useState(false)
  const debounceRef = useRef(null)
  const dropdownRef = useRef(null)
  const initializedRef = useRef(false)

  // When server data arrives asynchronously, initialize marker + fly once
  useEffect(() => {
    if (!initializedRef.current && lat != null && lng != null) {
      const latlng = [lat, lng]
      setCoords(latlng)
      setFlyTarget(latlng)
      initializedRef.current = true
    }
  }, [lat, lng])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setResults([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function pick(latlng) {
    setCoords(latlng)
    onChange?.(latlng[0], latlng[1])
  }

  function handleSearch(value) {
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

  function handleSelect(result) {
    const latlng = [
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
        const latlng = [
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
            <ul className="absolute top-full right-0 left-0 z-1000 mt-1 max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-card shadow-lg">
              {searching && (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  Searching…
                </li>
              )}
              {results.map((r, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(r)}
                  className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm text-white hover:bg-white/5"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
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
          className="flex items-center gap-1.5 rounded-xl border border-primary px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
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
        className="h-64 w-full rounded-2xl border border-white/10"
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
    </div>
  )
}
