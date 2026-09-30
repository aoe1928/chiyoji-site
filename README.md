English | [日本語](README.ja.md)

# Chiyoji's Website

A personal website built with Gatsby 5, with Japanese and English pages.

## Development

Requires Node.js 20 and npm. Run `npm install`, then `npm start` and open http://localhost:8000.

## Build and publish

`npm run build` generates the production site in `public/` without publishing it.

The current publishing workflow runs when `codex/decap-cms-trial` is pushed and publishes the generated site to `gh-pages`. `npm run deploy` also builds and publishes directly. The public site is https://www.aoe1928.com. Review changes before publishing; see DEPLOY_CHEATSHEET.md for background (its main-branch examples predate the current CMS workflow).

## App listings

`/apps/` and `/en/apps/` introduce Explorer Merge, Note Catcher, Live Bridge, py-img-tool and safe_eject. Edit `src/pages/apps.tsx` and `src/components/more-tools.tsx`. Listings include setup links and known verification limits; they do not imply compatibility with every environment.

## License

The existing Gatsby-derived 0BSD LICENSE is retained. Listed tools follow their own repository licenses. Images, character artwork, icons and logos are handled separately from code licenses; inclusion on this site does not grant redistribution rights.
