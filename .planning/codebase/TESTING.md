# Testing Patterns

**Analysis Date:** 2025-05-14

## Test Framework

**Runner:**
- Jest: Primary runner for the mobile application.
- Mocha/Anchor: Used for Solana program tests in the root `tests/` directory.

**Assertion Library:**
- `expect` (provided by Jest) for mobile.
- `chai` for Anchor/Mocha tests.

**Run Commands:**
```bash
npm test               # Run mobile app tests (from /mobile/App)
anchor test            # Run Solana program tests (from root)
```

## Test File Organization

**Location:**
- Co-located: Mobile tests are stored in `__tests__` subdirectories within the `src` folder (e.g., `mobile/App/src/utils/__tests__`).
- Separate: Solana program tests are in the root `tests/` directory.

**Naming:**
- `*.test.ts` or `*.test.tsx`.

**Structure:**
```
mobile/App/src/
├── components/
│   └── __tests__/
│       └── VerificationRequestModal.test.tsx
└── utils/
    └── __tests__/
        └── age.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe('component or utility name', () => {
  // Optional setup
  it('should perform expected behavior', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

**Patterns:**
- **Setup pattern:** Use of `beforeAll` and `afterAll` for setting up mocks or global state (e.g., system time).
- **Assertion pattern:** Use of `expect(...).toBe(...)` or `expect(...).toBeTruthy()`.

## Mocking

**Framework:** Jest

**Patterns:**
```typescript
// Mocking system time for deterministic date tests
beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-03-09'));
});

// Mocking function calls
const onApproveMock = jest.fn();
```

**What to Mock:**
- System clock for age calculations.
- Callback functions for component event testing.
- External service calls (observed in planned patterns).

**What NOT to Mock:**
- Pure logic utilities (test with real inputs).
- Basic UI components from React Native (use `@testing-library/react-native` to interact with them).

## Fixtures and Factories

**Test Data:**
```typescript
const mockRequest: VerificationRequest = {
  platformId: 'socialprofile.xyz',
  requestId: '12345',
  condition: 'age >= 18',
  userId: 'Jane Doe',
};
```

**Location:**
- Currently defined inline within test files.
- A `cli/src/fixtures` directory exists but is currently empty, suggesting a planned location for shared test data.

## Coverage

**Requirements:** None enforced in the current configuration.

**View Coverage:**
```bash
# Not explicitly configured in package.json, but standard Jest coverage can be run:
npm test -- --coverage
```

## Test Types

**Unit Tests:**
- Focused on utility logic in `mobile/App/src/utils/`.
- Tests for age calculation and condition checking.

**Component Tests:**
- Focused on React Native components using `@testing-library/react-native`.
- Verifies rendering logic and user interactions (press events).

**Integration Tests:**
- Anchor tests in `tests/minkyc.ts` are designed to test the full on-chain program flow, though currently in a stub state.

## Common Patterns

**Async Testing:**
- Use of `async/await` within `it` blocks for Anchor tests and component rendering if needed.

**Error Testing:**
- Testing that components don't render when visibility flags are false.
- Planned testing for invalid inputs in utilities.

---

*Testing analysis: 2025-05-14*
