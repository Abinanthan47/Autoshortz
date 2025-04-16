This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
autoshortz_ai
├─ app
│  ├─ (main)
│  │  ├─ create-new-video
│  │  │  ├─ page.jsx
│  │  │  └─ _components
│  │  │     ├─ Captions.jsx
│  │  │     ├─ Duration.jsx
│  │  │     ├─ Preview.jsx
│  │  │     ├─ Topic.jsx
│  │  │     ├─ VideoStyle.jsx
│  │  │     └─ Voice.jsx
│  │  ├─ dashboard
│  │  │  ├─ page.jsx
│  │  │  └─ _components
│  │  │     └─ VideoList.jsx
│  │  ├─ layout.jsx
│  │  ├─ play-video
│  │  │  ├─ [videoId]
│  │  │  │  └─ page.jsx
│  │  │  └─ _components
│  │  │     ├─ RemotionPlayer.jsx
│  │  │     └─ VideoInfo.jsx
│  │  ├─ provider.jsx
│  │  └─ _components
│  │     ├─ AppHeader.jsx
│  │     └─ AppSidebar.jsx
│  ├─ api
│  │  ├─ generate-script
│  │  │  └─ route.jsx
│  │  ├─ generate-video-data
│  │  │  └─ route.jsx
│  │  ├─ inngest
│  │  │  └─ route.jsx
│  │  ├─ regenerate-image
│  │  ├─ regenerate-video
│  │  ├─ test-tts
│  │  └─ text-to-speech
│  ├─ ConvexClientProvider.js
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.js
│  ├─ page.js
│  ├─ provider.js
│  ├─ _components
│  │  ├─ Authentication.jsx
│  │  ├─ Header.jsx
│  │  ├─ Hero.jsx
│  │  └─ RemotionComposition.jsx
│  └─ _context
│     └─ AuthContext.jsx
├─ components
│  └─ ui
│     ├─ button.jsx
│     ├─ input.jsx
│     ├─ scroll-area.jsx
│     ├─ select.jsx
│     ├─ separator.jsx
│     ├─ sheet.jsx
│     ├─ sidebar.jsx
│     ├─ skeleton.jsx
│     ├─ tabs.jsx
│     ├─ textarea.jsx
│     └─ tooltip.jsx
├─ components.json
├─ configs
│  ├─ AiModel.jsx
│  └─ firebaseConfig.js
├─ convex
│  ├─ schema.js
│  ├─ users.js
│  ├─ videoData.js
│  └─ _generated
│     ├─ api.d.ts
│     ├─ api.js
│     ├─ dataModel.d.ts
│     ├─ server.d.ts
│     └─ server.js
├─ doc
│  ├─ doc-filelist.js
│  ├─ doc-script.js
│  └─ doc-style.css
├─ docker-compose.yml
├─ hooks
│  └─ use-mobile.jsx
├─ inngest
│  ├─ client.js
│  └─ functions.js
├─ jsconfig.json
├─ lib
│  └─ utils.js
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ Anime.jpg
│  ├─ cartton.jpg
│  ├─ cinematic.jpg
│  ├─ cyberpunk.jpg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ gta.jpg
│  ├─ next.svg
│  ├─ pixar.jpg
│  ├─ realstic.jpg
│  ├─ vercel.svg
│  ├─ watercolor.jpg
│  └─ window.svg
├─ README.md
├─ remotion
│  ├─ Composition.jsx
│  ├─ index.js
│  └─ Root.jsx
└─ tailwind.config.mjs

```