import app from './app.js';
import { migrate } from './db/migrate.js';

const PORT = process.env['PORT'] ?? '3000';

await migrate();

app.listen(Number(PORT), () => {
  console.log(`Server listening on port ${PORT} [${process.env['NODE_ENV'] ?? 'development'}]`);
});
