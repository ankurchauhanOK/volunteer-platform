"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { stateOptions, categoryOptions } from "@/lib/utils"

interface FilterState {
  search: string
  state: string
  category: string
  skills: string
  womenFriendly: string
  creativeTasks: string
  ecoProject: string
}

interface ListingFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onReset: () => void
}

export function ListingFilters({ filters, onChange, onReset }: ListingFiltersProps) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
        <Input
          placeholder="Search destinations..."
          value={filters.search}
          onChange={e => update("search", e.target.value)}
        />
      </div>

      <Select
        label="State / Region"
        placeholder="All states"
        value={filters.state}
        onChange={e => update("state", e.target.value)}
        options={stateOptions.map(s => ({ value: s, label: s }))}
      />

      <Select
        label="Category"
        placeholder="All categories"
        value={filters.category}
        onChange={e => update("category", e.target.value)}
        options={categoryOptions.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
      />

      <Input
        label="Skills needed"
        placeholder="e.g. teaching, photography"
        value={filters.skills}
        onChange={e => update("skills", e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick filters</label>
        <div className="space-y-2">
          {[
            { key: "womenFriendly" as const, label: "Women-friendly" },
            { key: "creativeTasks" as const, label: "Creative tasks" },
            { key: "ecoProject" as const, label: "Eco projects" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                checked={filters[key] === "true"}
                onChange={e => update(key, e.target.checked ? "true" : "")}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={onReset} className="w-full">
        Reset filters
      </Button>
    </div>
  )
}
