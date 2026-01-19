# Online Voting

Frontend for an online voting service: browse polls, create polls (text options / image options), vote, and view results.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Redux Toolkit + RTK Query
- React Hook Form + Zod

## Quick Start

1) Install dependencies:

`npm i`

2) Create a `.env.local` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_IMGBB_API_KEY=your_imgbb_key
```

3) Start the dev server:

`npm run dev`

Open `http://localhost:5173`.

## Environment Variables

- `VITE_API_BASE_URL` — backend base URL (defaults to `http://localhost:3000`).
- `VITE_IMGBB_API_KEY` — ImgBB API key used for image uploads.

## Scripts

- `npm run dev` — run the app in development mode.
- `npm run build` — TypeScript build + Vite production build.
- `npm run preview` — preview the production build.
- `npm run lint` / `npm run lint:fix` — run ESLint / auto-fix issues.
- `npm run format` — format `./src` with Prettier.

## Routes

- `/` — home (polls list).
- `/auth` — login / signup.
- `/poll/:id` — poll page.
- `/poll/:id/results` — poll results.

## API (Expected Endpoints)

The client uses RTK Query and expects the following backend endpoints (see [src/reducer/api.ts](src/reducer/api.ts)):

- `POST /login`
- `POST /register`
- `POST /refresh`
- `POST /logout`
- `GET /polls` (with query params for filtering/pagination)
- `POST /polls` (create poll)
- `GET /polls/:pollId`
- `POST /polls/:pollId/votes`
- `GET /polls/:pollId/results`

Auth notes:
- `Authorization: Bearer <token>` is read from `localStorage`.
- `credentials: 'include'` is enabled (useful if refresh relies on cookies).

## Structure

- `src/pages` — pages (`Home`, `Auth`, `Poll`, `PollResults`).
- `src/components` — reusable UI components.
- `src/reducer` — store/slices + RTK Query API.
- `src/rout` — routing config.
- `src/public` — SVG/icons.
