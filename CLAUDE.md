# CLAUDE.md - @monbits/ui

UI component library guidance for Claude Code.

## Package Overview

**Package Name**: `@monbits/ui`
**Version**: 0.1.0
**Type**: React UI Component Library
**Philosophy**: shadcn/ui architecture (copy, paste, own your components)

Built on Radix UI primitives, Tailwind CSS v4, and class-variance-authority for type-safe component variants.

## Project Structure

| Path | Purpose |
|------|---------|
| `/src/components/ui/` | UI component implementations (32 components) |
| `/src/components/index.ts` | Component exports |
| `/src/hooks/` | React hooks (useMobile, useUrlState, useUrlPagination, useWindowSize) |
| `/src/lib/utils.ts` | Utility functions (`cn()` for class merging) |
| `/src/styles/globals.css` | Tailwind CSS v4 theme and global styles |
| `/src/index.ts` | Package entry point |
| `/dist/` | Build output (generated, do not edit) |
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript configuration |

## Build and Development

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run build` | Build library for production (outputs to `/dist/`) |
| `bun run dev` | Watch mode for development (auto-rebuild on changes) |

**Important**: After changes to `/src/`, always run `bun run build` to regenerate `/dist/`.

## Component Architecture

### Pattern: CVA + Radix + Tailwind

Components follow this structure:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const componentVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { sm: "...", default: "...", lg: "..." }
  },
  defaultVariants: { variant: "default", size: "default" }
});

function Component({ className, variant, size, ...props }: Props & VariantProps<typeof componentVariants>) {
  return <div className={cn(componentVariants({ variant, size, className }))} {...props} />;
}

export { Component, componentVariants };
```

**Key Principles**:
1. **Export variant functions** (`buttonVariants`, etc.) for reuse
2. **Use `cn()` for class merging** (from `lib/utils.ts`)
3. **Support `asChild` prop** for polymorphic rendering (via Radix Slot)
4. **Export TypeScript types** alongside components

### Component Files

| Component | File | Description |
|-----------|------|-------------|
| Alert | `alert.tsx` | Callout/notification component |
| Avatar | `avatar.tsx` | User avatar with fallback |
| Badge | `badge.tsx` | Status/label indicator |
| Breadcrumb | `breadcrumb.tsx` | Navigation breadcrumbs |
| Button | `button.tsx` | Primary interactive element |
| Calendar | `calendar.tsx` | Date picker (react-day-picker) |
| Card | `card.tsx` | Content container |
| Checkbox | `checkbox.tsx` | Checkbox input |
| Descriptions | `descriptions.tsx` | Key-value pair display |
| Dialog | `dialog.tsx` | Modal dialog (Radix Dialog) |
| Drawer | `drawer.tsx` | Bottom sheet (vaul) |
| Dropdown Menu | `dropdown-menu.tsx` | Context menu (Radix DropdownMenu) |
| Field | `field.tsx` | Form field wrapper |
| Form | `form.tsx` | Form wrapper (react-hook-form) |
| Icons | `icons.tsx` | Icon set (lucide-react) |
| Input | `input.tsx` | Text input |
| InputOTP | `input-otp.tsx` | OTP input (input-otp) |
| Label | `label.tsx` | Form label (Radix Label) |
| Popover | `popover.tsx` | Floating overlay (Radix Popover) |
| Select | `select.tsx` | Dropdown select (Radix Select) |
| Separator | `separator.tsx` | Visual divider (Radix Separator) |
| Sheet | `sheet.tsx` | Side panel (Radix Dialog variant) |
| Sidebar | `sidebar.tsx` | Application sidebar |
| Skeleton | `skeleton.tsx` | Loading placeholder |
| Sonner | `sonner.tsx` | Toast notifications (sonner) |
| Spinner | `spinner.tsx` | Loading spinner |
| Switch | `switch.tsx` | Toggle switch (Radix Switch) |
| Table | `table.tsx` | Data table |
| Tabs | `tabs.tsx` | Tabbed interface (Radix Tabs) |
| Textarea | `textarea.tsx` | Multi-line input |
| Toggle | `toggle.tsx` | Toggle button (Radix Toggle) |
| Tooltip | `tooltip.tsx` | Hover tooltip (Radix Tooltip) |

## Styling System

### Tailwind CSS v4 Configuration

**File**: `/src/styles/globals.css`

Uses `@import "tailwindcss"` and `@theme inline` block for theme configuration.

**CSS Variable System**:

| Variable Prefix | Purpose |
|-----------------|---------|
| `--color-*` | Tailwind color tokens (e.g., `--color-primary`) |
| `--mb-color-*` | Namespaced aliases to avoid conflicts |
| `--radius-*` | Border radius scale (`sm`, `md`, `lg`, `xl`) |
| `--mb-radius-*` | Namespaced radius aliases |

**Dark Mode**: Implemented via `.dark` class selector using `@custom-variant dark (&:is(.dark *))`.

### Theme Customization

Consumers can override CSS variables in their own stylesheets:

```css
:root {
  --primary: oklch(0.6 0.3 270);  /* Custom purple */
  --radius: 0.25rem;  /* Smaller radius */
}
```

### Color System

All colors use OKLCH color space for perceptually uniform gradients.

**Theme Colors**:
- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `destructive`
- `border`, `input`, `ring`
- `chart-1` through `chart-5`
- `sidebar-*` (sidebar-specific colors)

## Utilities

### `cn()` Function

**Location**: `/src/lib/utils.ts`

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose**: Intelligently merge Tailwind classes (handles conflicts like `px-2 px-4` → `px-4`).

**Usage**:
```tsx
cn("text-sm font-medium", className)
cn("p-4", isActive && "bg-primary")
```

## Hooks

| Hook | File | Description |
|------|------|-------------|
| `useMobile` | `use-mobile.ts` | Detects mobile viewport (<768px) |
| `useUrlPagination` | `use-url-pagination.ts` | URL-based pagination state |
| `useUrlState` | `use-url-state.ts` | Sync state with URL params |
| `useWindowSize` | `use-window-size.ts` | Window dimensions tracking |

## Package Exports

### Main Export

```ts
// src/index.ts
export * from "./components";
export * from "./hooks";
export * from "./lib";
```

**Consumer Usage**:
```tsx
import { Button, Card, cn, useMobile } from '@monbits/ui';
import '@monbits/ui/styles.css';
```

### Export Configuration

**File**: `package.json`

| Export Path | Resolves To | Purpose |
|-------------|-------------|---------|
| `.` | `dist/index.js` | Main entry (all exports) |
| `./styles.css` | `src/styles/globals.css` | Stylesheet import |
| `./components/*` | `dist/components/*.js` | Individual components |
| `./hooks/*` | `dist/hooks/*.js` | Individual hooks |

## Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `class-variance-authority` | ^0.7.1 | Type-safe component variants |
| `clsx` | ^2.1.1 | Conditional class names |
| `tailwind-merge` | ^3.3.1 | Intelligent Tailwind class merging |

### Peer Dependencies (Consumer Must Install)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.0 | React framework |
| `react-dom` | ^19.0.0 | React DOM rendering |
| `@radix-ui/*` | Various | Headless UI primitives |
| `lucide-react` | ^0.545.0 | Icon library |
| `input-otp` | ^1.4.2 | OTP input component |
| `next-themes` | ^0.4.6 | Theme switching |
| `react-day-picker` | ^9.11.1 | Calendar/date picker |
| `react-hook-form` | ^7.0.0 | Form state management |
| `sonner` | ^2.0.0 | Toast notifications |
| `vaul` | ^1.1.2 | Drawer component |
| `zod` | ^4.0.0 | Schema validation |

**Important**: Consumers must install all peer dependencies and configure Tailwind to scan `./node_modules/@monbits/ui/**/*.{js,ts,jsx,tsx}`.

## Development Workflow

### Adding New Components

1. Create component file in `/src/components/ui/{name}.tsx`
2. Export from `/src/components/ui/index.ts`
3. Build: `bun run build`
4. Test in consumer project

### Modifying Existing Components

1. Edit component in `/src/components/ui/{name}.tsx`
2. Rebuild: `bun run build`
3. Verify TypeScript types: Check `/dist/{name}.d.ts`

### Updating Styles

1. Edit `/src/styles/globals.css`
2. Rebuild: `bun run build`
3. Consumers must re-import stylesheet

## TypeScript Configuration

**File**: `tsconfig.json`

| Setting | Value | Reason |
|---------|-------|--------|
| `target` | `ES2020` | Modern JavaScript features |
| `module` | `ESNext` | ESM modules |
| `jsx` | `react-jsx` | React 17+ JSX transform |
| `declaration` | `true` | Generate `.d.ts` files |
| `skipLibCheck` | `true` | Faster builds |

## Build Configuration

**File**: `vite.config.ts`

**Mode**: Library mode (not application)

**Outputs**:
- `dist/index.js` (ESM)
- `dist/index.cjs` (CommonJS)
- `dist/index.d.ts` (TypeScript definitions)

**Externals**: All dependencies and peer dependencies are external (not bundled).

## Consumer Integration Requirements

### Critical Steps for Consumers

1. **Install peer dependencies** (see list above)
2. **Add Tailwind content path**:
   ```js
   content: ["./node_modules/@monbits/ui/**/*.{js,ts,jsx,tsx}"]
   ```
3. **Import stylesheet**:
   ```tsx
   import '@monbits/ui/styles.css';
   ```
4. **Optional: Configure theme** (override CSS variables)

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Component files | `kebab-case.tsx` | `dropdown-menu.tsx` |
| Component names | `PascalCase` | `DropdownMenu` |
| Variant functions | `{name}Variants` | `buttonVariants` |
| Utility functions | `camelCase` | `cn()` |
| Hook files | `use-{name}.ts` | `use-mobile.ts` |
| Hook names | `use{Name}` | `useMobile` |

## Testing in Consumer Projects

To test changes before publishing:

1. Build library: `cd monbits-ui && bun run build`
2. Link locally: `bun link` (in library directory)
3. Link in consumer: `bun link @monbits/ui` (in app directory)
4. Verify imports work and styles render

## Important Notes

### Do Not Edit Generated Files

| Path | Status |
|------|--------|
| `/dist/*` | Generated by Vite (overwritten on build) |
| `bun.lock` | Managed by Bun package manager |

### Breaking Changes to Avoid

- Renaming exported components
- Removing variant options
- Changing `cn()` function signature
- Removing CSS variables consumers may override

### Accessibility

All components use Radix UI primitives, which provide:
- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

Do not remove or override accessibility features.

## Dependencies Update Strategy

| Dependency | Update Strategy |
|------------|-----------------|
| Radix UI packages | Pin minor versions (breaking changes possible) |
| Tailwind | Follow v4 releases (currently in beta) |
| React | Pin to 19.x (peer dependency) |
| Lucide icons | Patch updates safe |

## Future Considerations

Potential enhancements (not currently implemented):

- Storybook documentation
- Visual regression testing
- Component usage analytics
- CSS-in-JS variant (non-Tailwind)
- Server component compatibility (React Server Components)

---

**Philosophy**: This library follows shadcn/ui principles. Components are meant to be **owned** by consumers. When in doubt, favor flexibility and customization over rigid abstractions.
