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

app comes up on `http://localhost:8417` (or whatever port you set in `docker-compose.yml`). data — `jobs.json` and all downloaded media — is stored in `./data`, which persists across restarts and rebuilds.

## usage

1. **dashboard** — paste a url under "quick add" to create a job
2. **downloads** — pick a format (mp4 / mp3 / m4a) to start downloading; download multiple formats of the same source if you want
3. **watch** — once a format finishes, open it to stream in-browser
4. **library** — grid view of everything fully downloaded

## notes

- supports any source yt-dlp supports, not just youtube
- re-adding the same url won't create a duplicate job — it reuses the existing one
- deleting a job removes its files from disk, not just the entry

## planned

- search/filter on downloads and library pages
- playlist and batch url support
- subtitle download
- working settings (default format, rescan library, clear failed jobs)
- job retry on failure
