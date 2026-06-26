# TFL FIFA 26 Prediction App

This folder is a static installable PWA. It can be hosted free and then wrapped into an Android APK.

## Free public URL

Option A: Netlify Drop

1. Open https://app.netlify.com/drop
2. Drag the `tfl-prediction-app` folder into the page.
3. Netlify returns a public HTTPS URL immediately.

Option B: GitHub Pages

1. Create a GitHub repository.
2. Upload the files from this folder.
3. In repository settings, enable Pages from the main branch.

Option C: Cloudflare Pages

1. Create a Pages project.
2. Upload this folder directly or connect a GitHub repo.
3. Use the generated `pages.dev` URL.

## APK generation

The easiest free path is PWABuilder:

1. Deploy the folder to a public HTTPS URL using one of the options above.
2. Open https://www.pwabuilder.com/
3. Paste the public URL.
4. Resolve any manifest warnings.
5. Choose Android package and download the generated APK/AAB.

Android Studio path:

1. Install Android Studio.
2. Install the latest Android SDK and Gradle.
3. Create a Trusted Web Activity project with the deployed PWA URL.
4. Build `Build > Generate Signed Bundle / APK`.

## Result sync

The app works fully with manual result entry. The Settings page also accepts a CORS-enabled football data API endpoint. Expected JSON shape:

```json
{
  "matches": [
    {
      "id": "R32-1",
      "home": "Argentina",
      "away": "Mexico",
      "homeGoals": 2,
      "awayGoals": 1,
      "scorers": ["Lionel Messi", "Julian Alvarez", "Santiago Gimenez"]
    }
  ]
}
```

Many reliable football providers block browser requests or require secret API keys. In production, place a tiny serverless proxy between this app and the provider, then put the proxy URL in Settings.

## Notes

- Initial leaderboard uses the supplied scores.
- Match scoring includes result, exact score, goal difference, scorers, own-goal penalties, total-goal overprediction penalties, and manual overrides.
- Tournament prediction scoring includes awards, semi-finalists, finalists, and champion by prediction phase.
- Browser local storage is the database for this version. Use Export Data regularly.
