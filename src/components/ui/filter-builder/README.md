# FilterBuilder

A composable, Linear-style filter builder component for data tables. Filters appear as horizontal chips that can be added, removed, and edited inline.

## Installation

The FilterBuilder is included in `@monbits/ui`. Import the components and hooks:

```tsx
import {
  FilterBuilder,
  FilterField,
  useFilterBuilder,
} from "@monbits/ui";
```

## Basic Usage (with URL Sync)

The recommended usage syncs filters to the URL, enabling shareable links and browser back/forward navigation:

```tsx
import {
  FilterBuilder,
  type FilterField,
  useFilterBuilder,
} from "@monbits/ui";
import { Clock, DollarSign } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const FILTER_FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    icon: <Clock className="h-4 w-4" />,
    options: [
      { value: "pending", label: "Pending", color: "#eab308" },
      { value: "completed", label: "Completed", color: "#22c55e" },
      { value: "failed", label: "Failed", color: "#ef4444" },
    ],
  },
  {
    id: "currency",
    label: "Currency",
    type: "select",
    icon: <DollarSign className="h-4 w-4" />,
    options: [
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
    ],
  },
];

function MyComponent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { filters, setFilters } = useFilterBuilder({
    fields: FILTER_FIELDS,
    searchParams,
    setSearchParams,
  });

  return (
    <FilterBuilder
      fields={FILTER_FIELDS}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
```

### Local State Only (no URL sync)

If you don't need URL sync, you can use the hook without any options:

```tsx
const { filters, setFilters } = useFilterBuilder();
```

## Filter Options with Colors

Add colored indicators to filter options for visual distinction:

```tsx
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#eab308" },     // yellow
  { value: "processing", label: "Processing", color: "#3b82f6" }, // blue
  { value: "completed", label: "Completed", color: "#22c55e" },  // green
  { value: "failed", label: "Failed", color: "#ef4444" },        // red
  { value: "cancelled", label: "Cancelled", color: "#6b7280" },  // gray
];
```

## Filter Options with Icons

Add icons to filter options using the `icon` property:

```tsx
import { CryptoIcon } from "src/components/crypto-icon/crypto-icon";

const CURRENCY_OPTIONS = [
  {
    value: "ETH",
    label: "ETH",
    icon: <CryptoIcon ticker="ETH" className="h-4 w-4" />
  },
  {
    value: "ETH_USDT",
    label: "ETH_USDT",
    icon: <CryptoIcon ticker="ETH_USDT" showComposite className="h-4 w-4" />
  },
  {
    value: "TRON_USDT",
    label: "TRON_USDT",
    icon: <CryptoIcon ticker="TRON_USDT" showComposite className="h-4 w-4" />
  },
];
```

## Converting Filters to API Parameters

The `useFilterBuilder` hook returns filter values that need to be converted to API parameters:

```tsx
function OrdersList() {
  const { filters, setFilters } = useFilterBuilder();

  // Convert filter builder filters to API params
  const apiFilters = React.useMemo(() => {
    const result: {
      status?: string;
      currency?: string;
      isTest?: boolean;
    } = {};

    for (const f of filters) {
      if (f.operator === "is") {
        if (f.field === "status") {
          result.status = f.value;
        } else if (f.field === "currency") {
          result.currency = f.value;
        } else if (f.field === "isTest") {
          result.isTest = f.value === "true";
        }
      }
    }

    return result;
  }, [filters]);

  // Use apiFilters in your data fetching
  const loadData = React.useCallback(async () => {
    const response = await api.listOrders({
      status: apiFilters.status,
      currency: apiFilters.currency,
      isTest: apiFilters.isTest,
    });
  }, [apiFilters]);

  return (
    <FilterBuilder
      fields={FILTER_FIELDS}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
```

## Complete Example

Here's a complete example from the Orders page:

```tsx
import {
  type ColumnDef,
  DataTable,
  FilterBuilder,
  type FilterField,
  useFilterBuilder,
} from "@monbits/ui";
import { Clock, Coins, DollarSign, FlaskConical } from "lucide-react";
import * as React from "react";
import { CryptoIcon } from "src/components/crypto-icon/crypto-icon";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#eab308" },
  { value: "partially_paid", label: "Partially Paid", color: "#3b82f6" },
  { value: "paid", label: "Paid", color: "#22c55e" },
  { value: "expired", label: "Expired", color: "#ef4444" },
  { value: "canceled", label: "Canceled", color: "#6b7280" },
];

const CRYPTO_CURRENCY_OPTIONS = [
  { value: "ETH", label: "ETH", icon: <CryptoIcon ticker="ETH" className="h-4 w-4" /> },
  { value: "ETH_USDT", label: "ETH_USDT", icon: <CryptoIcon ticker="ETH_USDT" showComposite className="h-4 w-4" /> },
  { value: "BSC_USDT", label: "BSC_USDT", icon: <CryptoIcon ticker="BSC_USDT" showComposite className="h-4 w-4" /> },
  { value: "TRON_USDT", label: "TRON_USDT", icon: <CryptoIcon ticker="TRON_USDT" showComposite className="h-4 w-4" /> },
];

const MODE_OPTIONS = [
  { value: "false", label: "Live", color: "#22c55e" },
  { value: "true", label: "Test", color: "#3b82f6" },
];

const FILTER_FIELDS: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "select",
    icon: <Clock className="h-4 w-4" />,
    options: ORDER_STATUS_OPTIONS,
  },
  {
    id: "cryptoCurrency",
    label: "Crypto",
    type: "select",
    icon: <Coins className="h-4 w-4" />,
    options: CRYPTO_CURRENCY_OPTIONS,
  },
  {
    id: "isTest",
    label: "Mode",
    type: "select",
    icon: <FlaskConical className="h-4 w-4" />,
    options: MODE_OPTIONS,
  },
];

export function OrdersList() {
  const { filters, setFilters } = useFilterBuilder();

  // Convert filters to API params
  const apiFilters = React.useMemo(() => {
    const result: {
      status?: string;
      cryptoCurrency?: string;
      isTest?: boolean;
    } = {};

    for (const f of filters) {
      if (f.operator === "is") {
        if (f.field === "status") {
          result.status = f.value;
        } else if (f.field === "cryptoCurrency") {
          result.cryptoCurrency = f.value;
        } else if (f.field === "isTest") {
          result.isTest = f.value === "true";
        }
      }
    }

    return result;
  }, [filters]);

  // Fetch data using apiFilters...

  return (
    <div className="space-y-6">
      <FilterBuilder
        fields={FILTER_FIELDS}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <DataTable
        columns={columns}
        data={orders}
        emptyMessage={
          filters.length > 0
            ? "No orders found. Try adjusting your filters."
            : "No orders yet."
        }
      />
    </div>
  );
}
```

## API Reference

### FilterBuilder Props

| Prop | Type | Description |
|------|------|-------------|
| `fields` | `FilterField[]` | Array of field definitions for available filters |
| `filters` | `FilterValue[]` | Current active filters |
| `onFiltersChange` | `(filters: FilterValue[]) => void` | Callback when filters change |
| `className` | `string?` | Optional CSS class name |

### FilterField

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the field |
| `label` | `string` | Display label for the field |
| `type` | `"select" \| "asyncSelect" \| "date"` | Field type |
| `icon` | `React.ReactNode?` | Optional icon to display |
| `options` | `FilterOption[]?` | Options for select fields |
| `loadOptions` | `(query: string) => Promise<FilterOption[]>?` | Async loader for asyncSelect |

### FilterOption

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Option value |
| `label` | `string` | Display label |
| `color` | `string?` | Optional color (hex or Tailwind class) |
| `icon` | `React.ReactNode?` | Optional icon |

### FilterValue

| Property | Type | Description |
|----------|------|-------------|
| `field` | `string` | Field ID this filter applies to |
| `operator` | `"is" \| "isNot" \| "before" \| "after"` | Filter operator |
| `value` | `string` | Selected value |
| `label` | `string?` | Optional display label for the value |

### useFilterBuilder Hook

```tsx
const {
  filters,      // FilterValue[] - current filters
  setFilters,   // (filters: FilterValue[]) => void
  addFilter,    // (filter: FilterValue) => void
  removeFilter, // (index: number) => void
  updateFilter, // (index: number, filter: FilterValue) => void
  clearFilters, // () => void
} = useFilterBuilder(options?);
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `initialFilters` | `FilterValue[]?` | Initial filters to set |
| `fields` | `FilterField[]?` | Filter fields - required for URL sync |
| `paramName` | `string?` | URL parameter name (default: "filters") |
| `searchParams` | `URLSearchParams?` | From `useSearchParams()[0]` - enables URL sync |
| `setSearchParams` | `function?` | From `useSearchParams()[1]` - enables URL sync |

#### URL Sync

To enable URL sync, pass all three: `fields`, `searchParams`, and `setSearchParams`:

```tsx
import { useSearchParams } from "react-router-dom";

function MyComponent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { filters, setFilters } = useFilterBuilder({
    fields: FILTER_FIELDS,
    searchParams,
    setSearchParams,
  });
}
```

When URL sync is enabled:
- Filters are stored in the URL as `?filters=status:is:pending,type:is:payment`
- Filters persist across page refreshes
- Browser back/forward navigation works
- Links with filters are shareable

## Field Types

### Select

Standard dropdown with predefined options:

```tsx
{
  id: "status",
  label: "Status",
  type: "select",
  options: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
}
```

### AsyncSelect

Dropdown with options loaded asynchronously (requires at least 2 characters):

```tsx
{
  id: "merchant",
  label: "Merchant",
  type: "asyncSelect",
  loadOptions: async (query) => {
    const results = await searchMerchants(query);
    return results.map(m => ({ value: m.id, label: m.name }));
  },
}
```

### Date

Date picker with relative date options:

```tsx
{
  id: "createdAt",
  label: "Created",
  type: "date",
}
```

Relative date options include: Today, Last 7 days, Last 30 days, This month, or pick a specific date.

## Filter Operators

- **is** / **isNot**: For select fields, toggle between equals and not equals
- **before** / **after**: For date fields, filter by date range

Click the operator button in the filter chip to toggle between operators.

## Styling

The FilterBuilder uses Tailwind CSS classes and integrates with the design system. Filter chips have:

- Rounded pill shape with border
- Field icon and label
- Clickable operator toggle
- Value dropdown with color/icon indicators
- Remove button

Colors are displayed as small colored dots next to the value label.
