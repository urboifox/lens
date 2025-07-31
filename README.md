# 🔭 Lens

Lens is a powerful, self-hosted inspection tool for nodejs applications. It provides automatic insights into your requests, database queries, and more, helping you debug and develop faster with a clean, intuitive UI.

## Features

- **Automatic Request & Response Logging:** Captures detailed information about incoming requests and outgoing responses in your app, including headers, body, and status codes.
- **Database Query Inspection:** Log and view SQL queries made during a request's lifecycle.
- **Interactive UI:** A modern and clean web interface built with SvelteKit to browse and analyze captured data.
- **Zero-Configuration Setup:** Get started quickly with minimal setup. Data is stored locally in a SQLite database.
- **Context-Aware Logging:** Automatically associates custom logs (like queries) with the corresponding request that triggered them using `AsyncLocalStorage`.

## Installation

```bash
# npm
npm install node-lens

# yarn
yarn add node-lens

# bun
bun add node-lens
```

## Usage

### Express Middleware

To get started, simply add the Lens middleware to your Express application.

```typescript
import express from 'express';
import { lens } from 'node-lens';

const app = express();

// Add the lens middleware.
// This will serve the UI at /lens by default.
app.use(lens());

// Your other routes and middleware...
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

Once your server is running, navigate to `http://localhost:3000/lens` to view the UI.

### Logging Custom Entries

You can log custom data, such as database queries, using the provided `logQuery` function. Lens will automatically associate the query with the currently active request.

```typescript
import { logQuery } from 'node-lens';

// Example within a database service or request handler
async function getUser(id: string) {
    const query = `SELECT * FROM users WHERE id = '${id}'`;

    // Log the query to Lens
    await logQuery(query);

    // ... execute query and return result
}
```

## API Reference

### `lens(options?: { path?: string }): Router`

Creates the Express middleware and returns an Express `Router`.

- `options.path`: The path to mount the Lens UI on. Defaults to `/lens`.

### `init(): Promise<void>`

Initializes the database schema. This is called automatically by the middleware on the first request, but you can call it manually if you're using the core functions without the Express middleware.

### `logQuery(query: string): Promise<void>`

A helper function to log a SQL query string. Automatically associates the query with the current request.

### `addEntry(entry: { content: Object; type: string; requestId?: string }): Promise<void>`

Adds a generic entry to the log. `logQuery` is a specialized version of this.

### `getEntries(): Promise<Entry[]>`

Retrieves all log entries from the database.

### `clearEntries(): Promise<void>`

Clears all log entries from the database.
