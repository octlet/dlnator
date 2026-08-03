# dlnator

a self-hosted tool to pull video/audio from youtube (and anything yt-dlp supports), store it locally, and watch or listen to it through a simple web ui.

## what it does

- paste a url, it fetches metadata (title, uploader, duration, thumbnail)
- download as mp4, mp3, or m4a
- stream downloads back through the browser — no re-download needed
- track everything in a dashboard: total jobs, in-progress, completed
- browse finished downloads in a library grid

## requirements

- docker + docker compose

## running it

```bash
docker compose up -d
```

app comes up on `http://localhost:3000` (or whatever port you set in `docker-compose.yml`). data — `jobs.json` and all downloaded media — is stored in `./data`, which persists across restarts and rebuilds.

by default the container binds to all interfaces, so it's also reachable from other devices on your network at `http://<your-machine-ip>:3000` (useful for phones/tablets). there's no authentication, so only do this on a network you trust.

## usage

1. **dashboard** — paste a url under "quick add" to create a job
2. **downloads** — pick a format (mp4 / mp3 / m4a) to start downloading; download multiple formats of the same source if you want
3. **watch** — once a format finishes, open it to stream in-browser
4. **library** — grid view of everything fully downloaded

## notes

- supports any source yt-dlp supports, not just youtube
- re-adding the same url won't create a duplicate job — it reuses the existing one
- deleting a job removes its files from disk, not just the entry
- jobs are currently stored in a flat `jobs.json` file — fine for personal use, not built for heavy concurrent use yet (see planned)

## planned

- migrate job storage from `jobs.json` to a proper database (better concurrency, no race conditions on simultaneous writes)
- search/filter on downloads and library pages
- playlist and batch url support
- subtitle download
- working settings (default format, rescan library, clear failed jobs)
- job retry on failure
- authentication

## contributing

this is an early, personal-use tool and there's plenty of room to improve it. issues and pull requests are welcome — whether it's a bug fix, a planned feature above, or something not listed here.

## a note on how this was built

this project is hand-designed and hand-reviewed, not vibe-coded — every change was deliberate and checked, not just accepted from a prompt. ai assistance was used along the way (mainly for code review, cleanup, and drafting), but the architecture, decisions, and final code are owned and understood, not blindly generated.
