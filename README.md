# RayMond Hall · Portfolio

**https://firelordray.github.io/Portfolio/**. One real project at a time.

**Stack:** React 19 · Tailwind CSS v4 · Vite 8 · Vitest, deployed to GitHub Pages by GitHub Actions.

### Adding a project

Everything the site says lives in [`src/data/site.js`](src/data/site.js). To show a new project:

1. Add an entry to `PROJECTS` (newest first): name, a one-line pitch, a short description,
   the tech it uses, a link to the code, and a `status` like "In progress" if it isn't done.
2. Want the big featured card? Add a 1280×800 screenshot to `public/projects/`, point `image`
   at it, and add a few `highlights`. Without one it goes in the grid.
3. Push. The page lays the card out by itself, and the tests check every project has what its
   card needs (including that a screenshot exists) and that the copy has no em dashes.

### Developing

```bash
npm install
npm run dev      # http://localhost:5174
npm test         # checks the site data
npm run lint
npm run build    # production build in dist/
```

Every push to `main` runs the tests and lint, then publishes (`.github/workflows/deploy.yml`).

### Credits

- The first version of this site (plain HTML and CSS) is in the git history, including
  the scramble effect on my name, now in `HyperText.jsx` (after Magic UI's HyperText, MIT).
- Layout inspired by [braydentw.io](https://braydentw.io) by Brayden W., who asks that his
  site be used as inspiration rather than copied. The code here is my own.
- The code-editor look (title bar, file explorer, tabs, snake game, terminal contact) is after
  [Developer Portfolio V2](https://github.com/alexdeploy/developer-portfolio-v2) (MIT License).
- The fire on the snake's tail is a Lottie animation from [LottieFiles](https://lottiefiles.com),
  played with [lottie-web](https://github.com/airbnb/lottie-web) (MIT License).
- The 3D keycaps are adapted from a keycap by 20essentials on [Uiverse.io](https://uiverse.io)
  (MIT License), the same ones as in [embertype](https://github.com/FIreLordRay/embertype).
- The GitHub mark is from [Primer Octicons](https://github.com/primer/octicons) (MIT License).
