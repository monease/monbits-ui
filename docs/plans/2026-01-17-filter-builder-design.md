# Filter Builder Design

Linear-style composable filter builder for data tables.

## Overview

Replace individual dropdown filters with a unified filter builder that allows users to add, combine, and remove filters dynamically. Filters display as horizontal chips and sync with URL for shareability.

## Requirements

- **URL-synced** - Filters stored in URL as structured string
- **Simple operators** - "is", "is not" for selects; "before", "after" for dates
- **Field types** - Static select, async select (API-backed), date
- **Location** - `@monease/monbits-ui` library
- **Visual** - Horizontal chips (Linear-style)
- **Interaction** - Nested menu for add filter flow

## Component Architecture

```
FilterBuilder (main container)
├── FilterChip (individual filter pill with field:op:value, removable)
├── AddFilterButton (triggers the nested menu)
└── FilterMenu (nested popover)
    ├── FilterFieldList (Status, Date, User, etc.)
    └── FilterValuePanel (operator + value selection, varies by field type)
        ├── FilterSelectValue (static/async select picker)
        └── FilterDateValue (date picker with relative options)
```

## Types

```typescript
type FilterOperator = "is" | "isNot" | "before" | "after";

type FilterFieldType = "select" | "asyncSelect" | "date";

interface FilterField {
  id: string;                    // e.g., "status", "createdAt"
  label: string;                 // e.g., "Status", "Created"
  type: FilterFieldType;
  icon?: React.ReactNode;
  // For select fields:
  options?: { value: string; label: string }[];
  // For async select:
  loadOptions?: (query: string) => Promise<{ value: string; label: string }[]>;
}

interface FilterValue {
  field: string;                 // field id
  operator: FilterOperator;
  value: string;
}
```

## Public API

### Usage Example

```tsx
import { FilterBuilder, useFilterBuilder } from "@monease/monbits-ui";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const fields: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    icon: <CircleDot className="h-4 w-4" />,
    options: STATUS_OPTIONS,
  },
  {
    id: "createdAt",
    label: "Created",
    type: "date",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: "user",
    label: "User",
    type: "asyncSelect",
    icon: <User className="h-4 w-4" />,
    loadOptions: async (query) => {
      const users = await searchUsers(query);
      return users.map(u => ({ value: u.id, label: u.email }));
    },
  },
];

function TransactionsPage() {
  const { filters, setFilters, clearFilters } = useFilterBuilder({
    fields,
    paramName: "filters",  // URL param name
  });

  // Convert filters to API params
  const apiParams = useMemo(() => {
    const params: Record<string, string> = {};
    for (const f of filters) {
      params[f.field] = f.value;
      params[`${f.field}_op`] = f.operator;
    }
    return params;
  }, [filters]);

  const { data } = useTransactions({ ...apiParams, page, limit });

  return (
    <FilterBuilder
      fields={fields}
      filters={filters}
      onFiltersChange={setFilters}
      onClear={clearFilters}
    />
  );
}
```

### Component Props

```typescript
interface FilterBuilderProps {
  fields: FilterField[];
  filters: FilterValue[];
  onFiltersChange: (filters: FilterValue[]) => void;
  onClear: () => void;
  className?: string;
}

interface UseFilterBuilderOptions {
  fields: FilterField[];
  paramName?: string;  // default: "filters"
}

interface UseFilterBuilderReturn {
  filters: FilterValue[];
  setFilters: (filters: FilterValue[]) => void;
  addFilter: (filter: FilterValue) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
}
```

## URL Serialization

### Format

```
?filters=status:is:pending,riskLevel:isNot:low,createdAt:after:2024-01-15
```

Format: `fieldId:operator:value` separated by commas.

### Encoding Rules

- Values with special characters (commas, colons) get URL-encoded
- Empty filters = no `filters` param in URL
- Invalid/malformed filters are silently ignored (defensive parsing)

### Implementation

```typescript
function serializeFilters(filters: FilterValue[]): string {
  return filters
    .map(f => `${f.field}:${f.operator}:${encodeURIComponent(f.value)}`)
    .join(",");
}

function parseFilters(str: string, fields: FilterField[]): FilterValue[] {
  if (!str) return [];
  return str.split(",")
    .map(part => {
      const [field, operator, value] = part.split(":");
      if (!field || !operator || !value) return null;
      if (!fields.some(f => f.id === field)) return null;
      return { field, operator, value: decodeURIComponent(value) };
    })
    .filter(Boolean) as FilterValue[];
}
```

## Visual Design

### Filter Chips Row

```
┌─────────────────────────────────────────────────────────────────┐
│ [⚙ Status is Pending ×]  [📅 Created after Jan 15 ×]  [+ Add Filter] │
└─────────────────────────────────────────────────────────────────┘
```

Each chip shows: icon + field name + operator + value + remove button. Chips wrap to next line on smaller screens.

### Nested Menu Flow

```
┌──────────────────────┐
│ 🔍 Search fields...  │
├──────────────────────┤
│ ⚙ Status           → │ ──▶ ┌─────────────────────┐
│ 🎯 Risk Level      → │     │ ○ is                │
│ 📅 Created         → │     │ ○ is not            │
│ 👤 User            → │     ├─────────────────────┤
└──────────────────────┘     │ □ Pending      (12) │
                              │ ☑ Completed    (45) │
                              │ □ Failed        (3) │
                              └─────────────────────┘
```

1. Click "Add Filter" → Field list appears with search
2. Hover/click field → Submenu slides out with operators at top
3. Select operator (defaults to "is")
4. Select value → Filter added, menu closes

### Date Submenu

```
┌─────────────────────┐
│ ○ before            │
│ ● after             │
├─────────────────────┤
│ Today               │
│ Last 7 days         │
│ Last 30 days        │
│ This month          │
│ Custom...           │ → Opens date picker
└─────────────────────┘
```

## Async Select Behavior

For fields with many options (users, wallets):

```
┌─────────────────────┐
│ ○ is               │
│ ○ is not           │
├─────────────────────┤
│ 🔍 Search users... │
├─────────────────────┤
│ Loading...         │
└─────────────────────┘

After typing:
┌─────────────────────┤
│ 🔍 john            │
├─────────────────────┤
│ john@example.com   │
│ john.doe@test.com  │
│ johnny@company.io  │
└─────────────────────┘
```

### Implementation Details

- Debounced search (300ms)
- Minimum 2 characters before searching
- Loading spinner during fetch
- Virtual scrolling at 50+ items using `@tanstack/react-virtual`
- Cache recent searches

### Static Select with Many Options

- Over 20 items: add search input at top
- Over 100 items: enable virtual scrolling

## File Structure

```
src/components/ui/filter-builder/
├── index.ts                    # Public exports
├── filter-builder.tsx          # Main container component
├── filter-chip.tsx             # Individual filter pill
├── filter-menu.tsx             # Nested popover menu
├── filter-field-list.tsx       # Left panel - field selection
├── filter-value-panel.tsx      # Right panel - operator + value
├── filter-select-value.tsx     # Select/AsyncSelect value picker
├── filter-date-value.tsx       # Date picker with relative options
├── use-filter-builder.ts       # Hook for URL sync & state
├── filter-utils.ts             # Serialize/parse helpers
└── types.ts                    # Shared types
```

## Dependencies

- `react-day-picker` - Already in monbits-ui
- `@tanstack/react-virtual` - Add for virtual scrolling (~3kb)
- Radix primitives - Already available (Popover, etc.)

## Exports

```typescript
// From @monease/monbits-ui
export { FilterBuilder } from "./filter-builder";
export { useFilterBuilder } from "./use-filter-builder";
export type { FilterField, FilterValue, FilterOperator, FilterFieldType } from "./types";
```

## Migration Path

Existing `UrlFilter` components can be gradually replaced. Both can coexist during migration:

```tsx
// Before
<UrlFilter paramName="status" label="Status" options={STATUS_OPTIONS} />
<UrlFilter paramName="risk" label="Risk" options={RISK_OPTIONS} />

// After
<FilterBuilder fields={fields} filters={filters} onFiltersChange={setFilters} />
```

## Future Considerations (Not in Scope)

- "is any of" / "is none of" operators (multi-select)
- AND/OR logic between filters
- Saved filter presets
- Filter counts (showing "Pending (12)")
