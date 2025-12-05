# EnergyApp Frontend

A Next.js application that displays UK energy forecasts and calculates optimal EV charging windows based on clean energy availability.

This project is the **frontend** for the EnergyApp system – it consumes the REST API exposed by the [EnergyApp Backend](https://github.com/malekkonrad/EnergyApp-backend).


## 🌟 Features

- **3-Day Energy Mix Forecast** - Visualizes the breakdown of energy sources (wind, solar, nuclear, etc.) for UK
- **EV Charging Optimizer** - Calculates the best time window to charge your electric vehicle based on clean energy availability
- **Interactive Charts** - Pie charts with custom labels showing energy source distribution
- **Responsive Design** - Mobile-friendly interface with CSS modules

## 🏗️ Architecture Overview

```
src/
├── api/              # API communication layer
├── components/       # UI components organized by feature
├── hooks/            # Custom React hooks
├── pages/            # Next.js routing
└── styles/           # Global CSS styles
```

## 📚 Documentation

### API Layer

#### `httpClient.ts`

Low-level HTTP client wrapping `fetch`.

**Main Functions:**
- `get<T>(url: string)` - Executes GET request
- `post<T>(url, body)` - Executes POST request


#### Render cold-start retry mechanism

Because both the frontend and backend are deployed on the free tier of Render (where services are put to sleep when idle), the first request after a period of inactivity can fail while services are still waking up.

To avoid surfacing this transient error to the user, the HTTP layer includes a simple retry strategy:

- When a request fails due to a temporary network / server error during wake-up,
- the client retries the request multiple times with short delays,
- so the user typically just sees a slightly longer initial loading state instead of an error screen.

This makes the UI much more robust against Render’s “cold start” behavior.


**Example:**
```typescript
const data = await httpClient.get<MyType>('/api/endpoint');
```

#### `energyService.ts`

Business service for backend communication.

**API Methods:**

##### `getEnergyMix(): Promise<EnergyMixDay[]>`
Fetches 3-day energy mix forecast for UK.

**Returns:**
```typescript
[
  {
    date: "2024-12-04",
    sources: { wind: 30, solar: 20, ... },
    cleanEnergyShare: 65.5
  },
  ...
]
```

##### `getOptimalWindow(payload: OptimalWindowRequest): Promise<OptimalWindowResponse>`
Calculates optimal time window for EV charging based on charging hours.

**Parameters:**
- `hours` - Number of charging hours (1-6)

**Returns:**
```typescript
{
  start: "2024-12-04T14:00:00Z",
  end: "2024-12-04T18:00:00Z",
  cleanEnergyShare: 75.5
}
```



### Custom Hooks

#### `useEnergyMix.ts`

Hook for fetching energy mix data.

**Returns:**
```typescript
{
  data: EnergyMixDay[] | null,
  loading: boolean,
  error: string | null
}
```

**Behavior:**
- Automatic fetch on mount
- Cleanup on unmount (flag `active`)
- Error logging to console

#### `useOptimalWindow.ts`

Hook for calculating optimal charging window.

**Returns:**
```typescript
{
  result: OptimalWindowResponse | null,
  loading: boolean,
  error: string | null,
  calculate: (hours: number) => Promise<void>
}
```

**Behavior:**
- Manual invocation via `calculate()`
- Resets error before each request
- Clears previous result on error


## 🌐 Backend Integration

The frontend expects the backend to expose:

```GET /api/energy-mix```

```GET /api/charging-window?hours={1–6}```

As long as ```NEXT_PUBLIC_API_BASE_URL``` is set correctly, all calls go through the energyService API layer.

## 🧪 Testing

All tests are located in `src/__tests__`.
Code coverage > 80%.
All core logic, hooks and components are covered by tests.

### Test Structure

```
__tests__/
├── api/              # API service tests
├── common/           # Common component tests
├── components/       # Business component tests
└── hooks/            # Custom hook tests
```

### Testing Tools

- **Jest** - Test framework
- **@testing-library/react** - Component testing
- **@testing-library/jest-dom** - DOM matchers

### Running Tests

```bash
npm run test          # Single run
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or compatible version
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd EnergyApp-frontend

# Install dependencies
npm install
# or
yarn install
```

Configure backend URL in `.env.development`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
