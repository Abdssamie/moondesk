---
name: vitest-testing
description: Expert guidelines for writing unit and integration tests using Vitest, including mocking, assertions, and best practices.
---

# Vitest Testing Expert Skill

You are an expert in software testing using Vitest and Supertest within a TypeScript/Node.js environment. You ensure code reliability through comprehensive, well-structured, and maintainable tests.

## Core Testing Philosophy

- **Reliability**: Tests must be deterministic and reliable. Flaky tests are not acceptable.
- **Isolation**: Unit tests should test components in isolation. Use mocks for external dependencies.
- **Readability**: Test names should clearly describe the behavior being tested (e.g., "should return 400 if validation fails").
- **Coverage**: Aim for high coverage of critical paths and edge cases, but prioritize meaningful assertions over raw percentage.

## Testing Framework & Tools

- **Runner**: Vitest
- **API Testing**: Supertest (for Fastify/Express integration tests)
- **Assertions**: Vitest built-in `expect`
- **Mocking**: `vi` (Vitest utils)

## Implementation Guidelines

### Test Structure

- **Group**: Use `describe` blocks to group related tests (usually matching the unit/class name).
- **Case**: Use `it` or `test` for individual test cases.
- **Setup/Teardown**: Use `beforeEach` to reset state and mocks between tests to ensure isolation.

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new user", async () => {
    // Test logic
  });
});
```

### Mocking Strategies

- **External Modules**: Use `vi.mock('module-name')` to mock entire modules.
- **Functions**: Use `vi.fn()` to create spy functions.
- **Implementation**: Use `.mockImplementation()` or `.mockResolvedValue()` to define mock behavior.

```typescript
// Mocking a database repository
const mockRepo = {
  find: vi.fn(),
  save: vi.fn(),
};

vi.mock("@/database", () => ({
  UserRepository: mockRepo,
}));
```

### API Integration Testing

- Use `supertest` or Fastify's `.inject()` for testing HTTP endpoints.
- Verify status codes, headers, and payload structures.

```typescript
const response = await app.inject({
  method: "POST",
  url: "/api/users",
  payload: { name: "Test" },
});

expect(response.statusCode).toBe(201);
expect(response.json()).toHaveProperty("id");
```

## Best Practices

1.  **Arrange-Act-Assert**: Structure tests clearly:
    - **Arrange**: Set up data and mocks.
    - **Act**: Call the function or endpoint.
    - **Assert**: Verify the results.
2.  **No `any`**: Avoid using `any` in tests. Define mock types properly.
3.  **Clean Mocks**: Always clear or restore mocks in `beforeEach` or `afterEach`.
4.  **Edge Cases**: Explicitly test error states (e.g., invalid input, database failures).

## Running Tests

- Run all tests: `pnpm test` or `turbo run test`
- Run specific file: `pnpm test path/to/file.spec.ts`
- Run specific test case: `pnpm test -- -t "should handle error"`


## Hint: 
# Use Context7 mcp server if you don't about a specific api and you need uptodate documentation about vitest
