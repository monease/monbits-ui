# @monbits/ui

A comprehensive React UI component library built on [shadcn/ui](https://ui.shadcn.com/) principles, featuring Radix UI primitives, Tailwind CSS v4, and class-variance-authority.

## Installation

Install the package using bun (or npm/pnpm/yarn):

```bash
bun add @monbits/ui
```

### Peer Dependencies

This library requires the following peer dependencies. Install them if not already present:

```bash
bun add react@^19.0.0 react-dom@^19.0.0
bun add @radix-ui/react-avatar@^1.1.10 \
        @radix-ui/react-checkbox@^1.3.3 \
        @radix-ui/react-dialog@^1.1.15 \
        @radix-ui/react-dropdown-menu@^2.1.16 \
        @radix-ui/react-label@^2.1.7 \
        @radix-ui/react-popover@^1.1.15 \
        @radix-ui/react-select@^2.2.6 \
        @radix-ui/react-separator@^1.1.7 \
        @radix-ui/react-slot@^1.2.4 \
        @radix-ui/react-switch@^1.2.6 \
        @radix-ui/react-tabs@^1.1.13 \
        @radix-ui/react-toggle@^1.1.10 \
        @radix-ui/react-toggle-group@^1.1.11 \
        @radix-ui/react-tooltip@^1.2.8
bun add input-otp@^1.4.2 lucide-react@^0.545.0 \
        next-themes@^0.4.6 react-day-picker@^9.11.1 \
        react-hook-form@^7.0.0 sonner@^2.0.0 \
        vaul@^1.1.2 zod@^4.0.0
```

### Tailwind CSS Configuration

**CRITICAL**: You must configure Tailwind to scan the library's component files. Add the following to your `tailwind.config.js` or `tailwind.config.ts`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add this line to include @monbits/ui components
    "./node_modules/@monbits/ui/**/*.{js,ts,jsx,tsx}"
  ],
  // ... rest of your config
}
```

Without this configuration, component styles will not render correctly.

### Import Styles

Import the global CSS file in your application entry point (e.g., `main.tsx`, `App.tsx`, or `_app.tsx`):

```tsx
import '@monbits/ui/styles.css';
```

## Basic Usage

Import components and utilities from the package:

```tsx
import { Button, Card, cn } from '@monbits/ui';

function App() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Monbits UI</h1>
      <Button variant="default">Click me</Button>
      <Button variant="outline" className="ml-2">Outline</Button>
    </Card>
  );
}
```

### Component Examples

#### Button Variants

```tsx
import { Button } from '@monbits/ui';

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// As child component (polymorphic)
<Button asChild>
  <a href="/dashboard">Dashboard</a>
</Button>
```

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@monbits/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@monbits/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

#### Form with Field

```tsx
import { Field, Input, Label, Button } from '@monbits/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

function MyForm() {
  const form = useForm({
    defaultValues: { email: '' }
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      <Field>
        <Label>Email</Label>
        <Input {...form.register('email')} type="email" />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

#### Dropdown Menu

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@monbits/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Available Components

| Component | Description |
|-----------|-------------|
| **Alert** | Callout/notification component for important messages |
| **Avatar** | User avatar with fallback support |
| **Badge** | Small status or label indicator |
| **Breadcrumb** | Navigation breadcrumb trail |
| **Button** | Primary interactive element with variants |
| **Calendar** | Date picker calendar component |
| **Card** | Container for grouped content |
| **Checkbox** | Checkbox input with label support |
| **Descriptions** | Key-value pair display component |
| **Dialog** | Modal dialog overlay |
| **Drawer** | Mobile-friendly bottom sheet drawer |
| **Dropdown Menu** | Context menu with actions |
| **Field** | Form field wrapper component |
| **Form** | Form wrapper with react-hook-form integration |
| **Icons** | Common icon set (powered by lucide-react) |
| **Input** | Text input field |
| **InputOTP** | One-time password input component |
| **Label** | Form label component |
| **Popover** | Floating content overlay |
| **Select** | Dropdown select input |
| **Separator** | Visual divider line |
| **Sheet** | Side panel overlay |
| **Sidebar** | Application sidebar navigation |
| **Skeleton** | Loading placeholder skeleton |
| **Sonner** | Toast notification system |
| **Spinner** | Loading spinner indicator |
| **Switch** | Toggle switch input |
| **Table** | Data table component |
| **Tabs** | Tabbed interface component |
| **Textarea** | Multi-line text input |
| **Toggle** | Toggle button component |
| **Tooltip** | Hover tooltip component |

## Available Hooks

| Hook | Description |
|------|-------------|
| **useMobile** | Detects mobile viewport breakpoints |
| **useUrlPagination** | URL-based pagination state management |
| **useUrlState** | Syncs state with URL search parameters |
| **useWindowSize** | Tracks window dimensions |

## Theming

### Customizing Colors

Override CSS variables in your application's global CSS to customize the theme:

```css
:root {
  --primary: oklch(0.95 0.28 127);  /* Your brand color */
  --primary-foreground: oklch(0.2 0.02 127);
  --destructive: oklch(0.577 0.245 27.325);
  --radius: 0.5rem;  /* Global border radius */
}

.dark {
  --primary: oklch(0.95 0.28 127);
  --primary-foreground: oklch(0.15 0.02 127);
}
```

### Color System

The library uses OKLCH color space for perceptually uniform colors. All theme colors are available as CSS variables:

- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive`
- `--border` / `--input` / `--ring`
- `--sidebar-*` (sidebar-specific colors)
- `--chart-1` through `--chart-5` (chart colors)

### Namespaced Aliases

All color variables are also available with `--mb-` prefix to avoid conflicts:

```css
--mb-color-primary
--mb-color-background
--mb-radius-lg
```

### Dark Mode

The library supports dark mode via the `.dark` class. Use `next-themes` or similar library to toggle:

```tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>
```

## Extensibility

Following shadcn/ui philosophy, components are designed to be extended and customized.

### Using the `cn()` Utility

The `cn()` function merges Tailwind classes intelligently, allowing you to override component styles:

```tsx
import { Button, cn } from '@monbits/ui';

// Override default styles
<Button className={cn("bg-blue-500 hover:bg-blue-600")}>
  Custom Blue Button
</Button>

// Conditional classes
<Button className={cn(
  "font-semibold",
  isActive && "ring-2 ring-primary"
)}>
  Conditional Styling
</Button>
```

### Accessing Variant Functions

Most components export their variant configuration for reuse:

```tsx
import { buttonVariants } from '@monbits/ui';

// Use button styles on a link
<a href="/home" className={buttonVariants({ variant: "outline", size: "sm" })}>
  Home
</a>
```

### Composition Patterns

Components support composition through the `asChild` prop (via Radix Slot):

```tsx
import { Button } from '@monbits/ui';
import { Link } from 'react-router-dom';

// Button renders as Link component
<Button asChild>
  <Link to="/dashboard">Dashboard</Link>
</Button>
```

### Extending Components

Create your own component variants by wrapping library components:

```tsx
import { Button, type ButtonProps } from '@monbits/ui';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export function LoadingButton({ loading, children, ...props }: LoadingButtonProps) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions. Import types alongside components:

```tsx
import type { ButtonProps, CardProps } from '@monbits/ui';
```

## Development

This library uses shadcn/ui patterns:

- **Radix UI**: Headless, accessible component primitives
- **Tailwind CSS v4**: Utility-first CSS framework
- **class-variance-authority (CVA)**: Type-safe variant management
- **clsx + tailwind-merge**: Intelligent class merging

Components are designed to be:
- **Accessible**: ARIA-compliant via Radix UI
- **Composable**: Use `asChild` for polymorphic rendering
- **Customizable**: Override styles via `className` prop
- **Type-safe**: Full TypeScript support

## License

Apache 2.0

## Support

For issues or questions, refer to the [GitHub repository](https://github.com/monease/oxygen).
