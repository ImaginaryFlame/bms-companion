# BMS Companion (squelette)

 Squelette minimal Vite + React + TypeScript pour construire le hub BMS (tournois, Talents, notifications, Has Joel Streamed Today).

## Démarrage

1. Copier l'exemple d'env: `cp .env.example .env`
2. Installer: `npm install`
3. Lancer: `npm run dev`

## Structure

- `src/pages`: pages du hub (Home, Tournaments, Talents, HasJoelStreamedToday, Notifications)
- `src/components`: composants UI (NavBar, NotificationBell, LiveBadge, etc.)
- `src/services`: services et intégrations (Twitch/Helix, notifications, tournois)
- `src/store`: état global (zustand)

 Ce repo ne contient que des stubs; reportez-vous au tutoriel dans la discussion pour l'implémentation complète.

 Remarque: la page BMS Tracker a été retirée de ce squelette à ta demande. Intègre ton tracker existant ultérieurement si nécessaire.
