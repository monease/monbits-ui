# @monease/monbits-ui

A React UI component library built on [shadcn/ui](https://ui.shadcn.com/) patterns with Radix UI primitives and Tailwind CSS v4.

## Installation

This package is hosted on GitHub Packages. Add the registry to your project:

```bash
# Create .npmrc in your project root
echo "@monease:registry=https://npm.pkg.github.com" > .npmrc

# Install the package
npm install @monease/monbits-ui
```

### Peer Dependencies

Install the required peer dependencies:

```bash
npm install react react-dom lucide-react next-themes react-hook-form zod
```

That's it. Radix UI and other dependencies are bundled with the package.

### Tailwind CSS v4 Configuration

Add the `@source` directive to your CSS file to scan the package for Tailwind classes:

```css
@import "tailwindcss";

@source "../node_modules/@monease/monbits-ui/src";
```

The path is relative to your CSS file. For a typical setup with CSS at `src/app.css`, use `../node_modules/...` to reach `node_modules/` at the project root.

## Usage

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@monease/monbits-ui";

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Utilities

```tsx
import { cn } from "@monease/monbits-ui";

// Merge Tailwind classes intelligently
<div className={cn("p-4", isActive && "bg-primary")} />
```

### Variant Functions

```tsx
import { buttonVariants } from "@monease/monbits-ui";

// Apply button styles to any element
<a href="/home" className={buttonVariants({ variant: "outline", size: "sm" })}>
  Home
</a>
```

## Components

| Component | Description |
|-----------|-------------|
| Alert | Callout for important messages |
| Avatar | User avatar with fallback |
| Badge | Status indicator |
| Breadcrumb | Navigation trail |
| Button | Interactive button with variants |
| Calendar | Date picker |
| Card | Content container |
| Checkbox | Checkbox input |
| Descriptions | Key-value display |
| Dialog | Modal overlay |
| Drawer | Bottom sheet (mobile-friendly) |
| DropdownMenu | Context menu |
| Field | Form field wrapper |
| Form | Form with react-hook-form |
| Icons | Icon set (lucide-react) |
| Input | Text input |
| InputOTP | One-time password input |
| Label | Form label |
| Popover | Floating overlay |
| Select | Dropdown select |
| Separator | Visual divider |
| Sheet | Side panel |
| Sidebar | App sidebar |
| Skeleton | Loading placeholder |
| Sonner | Toast notifications |
| Spinner | Loading indicator |
| Switch | Toggle switch |
| Table | Data table |
| Tabs | Tabbed interface |
| Textarea | Multi-line input |
| Toggle | Toggle button |
| Tooltip | Hover tooltip |

## Hooks

| Hook | Description |
|------|-------------|
| `useMobile` | Detect mobile viewport |
| `useUrlPagination` | URL-based pagination |
| `useUrlState` | Sync state with URL params |
| `useWindowSize` | Track window dimensions |

## Theming

Override CSS variables in your stylesheet:

```css
:root {
  --primary: oklch(0.6 0.25 260);
  --radius: 0.5rem;
}

.dark {
  --primary: oklch(0.7 0.2 260);
}
```

### Available Variables

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`
- `--border`, `--input`, `--ring`
- `--radius`

## Dark Mode

Use `next-themes` to toggle dark mode:

```tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>
```

## License

Apache 2.0
