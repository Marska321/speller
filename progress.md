Original prompt: i would like to update the colors of the game and also update the name to Speller instead of Spellie

- 2026-03-30: Updating the player-facing app name to Speller while preserving existing internal storage keys for backward compatibility.
- 2026-03-30: Refreshing the main color palette and high-contrast palette to feel warmer and more classroom-friendly.
- 2026-03-30: Verified with `npm run typecheck` and `npm run build`. Terminal-side local serving worked, but the embedded browser tool could not reach the local server in this environment.
- 2026-03-30: Applied the provided palette to the default Speller theme with `#5A9CB5` for the header, `#FACE68` for present-state highlights, `#FAAC68` for match-state highlights, and `#FA6868` for miss-state accents, while keeping dark text for readability.
