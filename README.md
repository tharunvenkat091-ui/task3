# Book REST API — Vercel Version

This version is prepared for Vercel deployment.

## Deploy

1. Upload this folder/project to GitHub.
2. Import the repository into Vercel.
3. Framework Preset: Other.
4. Build Command: leave empty.
5. Output Directory: leave empty.
6. Deploy.

The homepage is `index.html`.

## API

GET    /api/books
POST   /api/books
PUT    /api/books?id=1
DELETE /api/books?id=1

The UI automatically uses the Vercel API.

## Important assignment note

The assignment says no database, so this demo stores books in memory. Serverless instances can restart, so the data is not permanent. For permanent production data, a database such as MongoDB would be required.
