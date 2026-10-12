import React, { useEffect, useRef, useState } from "react";
import { useGeocoding } from "@/hooks/tracking/use-geocoding";
import { AddressSuggestion } from "@/api/http/types/maps";

interface Props {
  onLocationFound: (lat: number, lng: number, address: string) => void;
}

const C = {
  text: "#111827",
  muted: "#6B7280",
  accent: "#22C55E",
  accentSoft: "#F0FDF4",
  card: "#FFFFFF",
  border: "#EDEDED",
};

const SearchIcon = ({ color = C.muted }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PinIcon = ({ color = C.accent }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "fs-spin 0.8s linear infinite" }}>
    <style>{`@keyframes fs-spin{to{transform:rotate(360deg)}}`}</style>
    <circle cx="12" cy="12" r="9" fill="none" stroke={C.border} strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export function LocationSearchInput({ onLocationFound }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [active, setActive] = useState(-1);
  const justSelected = useRef(false);
  const { search } = useGeocoding();

  // Autocompletado con debounce (política OSM: ~1 req/s)
  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    if (query.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      const results = await search(query);
      setSuggestions(results);
      setActive(-1);
      setOpen(results.length > 0);
      setSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const pick = (s: AddressSuggestion) => {
    justSelected.current = true;
    setQuery(s.label);
    setSuggestions([]);
    setOpen(false);
    onLocationFound(s.lat, s.lng, s.label);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(suggestions[active]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  // Primera línea (calle) y segunda (resto) a partir del label completo
  const split = (s: AddressSuggestion) => {
    const parts = s.label.split(",").map((p) => p.trim());
    return { primary: s.street || parts[0], secondary: parts.slice(1).join(", ") };
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "12px 14px",
          boxShadow: "0 6px 18px rgba(17,24,39,0.08)",
        }}
      >
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Busca tu dirección de entrega"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 15,
            color: C.text,
            background: "transparent",
          }}
        />
        {searching && <Spinner />}
        {!searching && query.length > 0 && (
          <button
            onMouseDown={() => { setQuery(""); setSuggestions([]); setOpen(false); }}
            aria-label="Limpiar"
            style={{ border: "none", background: "transparent", cursor: "pointer", color: C.muted, fontSize: 18, lineHeight: 1 }}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <ul
          style={{
            listStyle: "none",
            margin: "8px 0 0",
            padding: 6,
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            maxHeight: 280,
            overflowY: "auto",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            boxShadow: "0 12px 28px rgba(17,24,39,0.16)",
            boxSizing: "border-box",
          }}
        >
          {suggestions.map((s, i) => {
            const { primary, secondary } = split(s);
            return (
              <li
                key={`${s.lat},${s.lng},${i}`}
                onMouseDown={() => pick(s)}
                onMouseEnter={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderRadius: 12,
                  background: active === i ? C.accentSoft : "transparent",
                }}
              >
                <span style={{ marginTop: 2, flexShrink: 0 }}>
                  <PinIcon color={active === i ? C.accent : C.muted} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {primary}
                  </div>
                  {secondary && (
                    <div style={{ fontSize: 12.5, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {secondary}
                    </div>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
