# BINTROTTER

Host your own private torrent search without the insane ads and popups.

Currently supports YTS.mx and thepiratebay.

Basic authentication to keep it from being overused or misused.

## Stack

This is a Sveltekit application, built for use on Cloudflare Pages.

On the backend, it uses the [open movie database](http://www.omdbapi.com) as well
as api calls out to the Yify and TPB sites for torrent data.

Also uses Cloudflare KV store for caching data retrieved from those sites, to speed
things up and also prevent placing a noticeable burden on the services used.

## Installation

1. Fork this repo.
2. Get an api key from [open movie database](http://www.omdbapi.com)
3. (Optional) Create a KV namespace at cloudflare
4. Create a new Cloudflare Pages app, configured for Sveltekit, and drawing from this codebase.

   It should have the following environment variables:

   - OMDB_API_KEY=**\*\*\*\***
   - ADMIN_LOGIN=username:password
   - KV_NAMESPACE=CLOUDFLARE_KV_BINDING <-- omit or leave blank to skip using KV.

5. Deploy & Enjoy!

![Torrent Detail](https://raw.githubusercontent.com/tylergannon/bintrotter/main/screenshots/detail.png)
![Home Page](https://raw.githubusercontent.com/tylergannon/bintrotter/main/screenshots/homepage.png)
![YTS Form](https://raw.githubusercontent.com/tylergannon/bintrotter/main/screenshots/yts_page.png)
![TPB Form](https://raw.githubusercontent.com/tylergannon/bintrotter/main/screenshots/tpb_page.png)
