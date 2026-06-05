# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Google Sheets sync

Names, phone numbers, and predictions are saved in `localStorage` first. If `VITE_SHEETS_WEBHOOK_URL` is set, the app also sends participant details and each prediction to the Apps Script webhook in the background.

To make the webhook accept browser submissions:

1. Open the Google Sheet and add the code from `google-sheets-webhook.gs` in Extensions -> Apps Script.
2. Deploy it as a web app.
3. Set "Execute as" to your account.
4. Set "Who has access" to "Anyone".
5. Copy the `/exec` web app URL into `.env` as `VITE_SHEETS_WEBHOOK_URL`.

If the endpoint returns `HTTP 401`, Google has not published it for anonymous web app access yet. Redeploy a new web app version after changing access settings.

If the endpoint returns "Script function not found: doPost", the deployed web app version does not include the webhook code. Save the Apps Script file, choose Deploy -> Manage deployments -> Edit -> Version -> New version, deploy again, then copy the new `/exec` URL.

Opening the `/exec` URL in a browser should return JSON with `ok: true`. Browser visits use `doGet`; app submissions use `doPost`.

The script creates two tabs:

- `Participants`: one row per phone number. Saving the same phone again updates the name and timestamp.
- `Predictions`: one row per phone number and match. Submitting the same match again updates that prediction.
- `Rankings`: rebuilt after each participant or prediction save.

To clean old duplicate participant rows after deploying this script, open the web app URL with `?cleanup=participants` appended:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?cleanup=participants
```

## Match scores

The bundled fixture list is only a fallback. To keep scores correct for every visitor, publish a JSON score feed and set:

```text
VITE_MATCHES_FEED_URL=https://your-domain.example/matches-live.json
```

The app fetches this URL on page load and every 60 seconds, then caches the latest scores in `localStorage`. Predictions, rankings, the match board, and the live ticker all read the same merged match data.

Feed shape:

```json
{
  "updated_at": "2026-06-11T22:05:00.000Z",
  "matches": [
    {
      "id": "M001",
      "status": "finished",
      "actual_home": 2,
      "actual_away": 1,
      "updated_at": "2026-06-11T21:55:00.000Z"
    }
  ]
}
```

Use a backend, serverless function, or scheduled job to pull scores from a licensed sports data provider or official source and write this JSON. Do not rely on hardcoded frontend scores for live results.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
