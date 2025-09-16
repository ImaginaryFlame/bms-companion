# BMS Companion (squelette)

Squelette minimal Vite + React + TypeScript pour construire le hub BMS (Talents, Has Joel Streamed Today).

Monorepo: le projet mobile (Expo/React Native) est rangé sous `apps/mobile`.

## Démarrage

1. Copier l'exemple d'env: `cp .env.example .env`
2. Installer: `npm install`
3. Lancer: `npm run dev`

## Structure

- `src/pages`: pages du hub (Home, Talents, HasJoelStreamedToday)
- `src/components`: composants UI (NavBar, LiveBadge, etc.)
- `src/services`: services et intégrations (Twitch/Helix)
- `src/store`: état global (le store Notifications a été retiré)

Ce repo ne contient que des stubs; reportez-vous au tutoriel dans la discussion pour l'implémentation complète.

Remarque: la section Tournois a été retirée à ta demande. La page BMS Tracker avait aussi été retirée précédemment; intègre ton tracker existant ultérieurement si nécessaire.

## Mobile (Android) - apps/mobile

- Dossier: `apps/mobile`
- Installer: `cd apps/mobile && npm install`
- Dev (Expo Go): `npx expo start`
- Build dev Android: `npx expo run:android`
- Build prod (EAS): `eas build -p android`

Si tu avais un dossier `bms-companion-mobile` ouvert dans un éditeur, ferme-le puis supprime-le. Nous avons copié le contenu vers `apps/mobile`. Si la suppression échoue sur Windows (fichiers verrouillés), redémarre l'IDE/terminal puis supprime.
