# SariTrack

Sari-sari store sales and stock monitor. Plain JavaScript, MVC with a base View class, data saved in localStorage (no backend).

## Run locally
ES modules do not work when you double-click index.html. Use a local server, for example the VS Code "Live Server" extension, or run `python3 -m http.server` in this folder and open http://localhost:8000.

## Publish on GitHub Pages
1. Push the project to your GitHub repo (index.html at the top level).
2. Repo Settings, Pages, Source: Deploy from a branch, branch `main`, folder `/ (root)`, Save.
3. Wait a minute, then open the link GitHub shows and test it.

## Structure
- js/model.js: the state object, localStorage save/load, all data functions
- js/views/: View.js (base class) and one view per feature
- js/controller.js: connects views and model
