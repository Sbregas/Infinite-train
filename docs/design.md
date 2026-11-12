# The Infinite Train — Night journey

The user delegated a fresh prototype after rejecting the old archive. Build an explorable community train, not a marketing page. Preserve the existing repository and deliver a feature branch and PR without merging.

Direction: an expansive original pixel-art night railway, copper engine and four miniature worlds (greenhouse, library, koi garden, observatory), minimal Italian controls and warm ivory typography. The train is the working product: procedural Canvas artwork, not a placeholder screenshot. Alternative directions considered: a carriage gallery (too static), a 3D railway (heavier assets and interaction), and this 2D journey (chosen by the implementer for mobile performance and portability).

Use static HTML/CSS/ES modules, no runtime dependencies, deployable beneath the GitHub Pages repository path. Navigation: canvas swipe/drag, previous/next, keyboard, carriage list. Pause and reduced-motion support; accessible HTML equivalents for canvas interactions. A dawn palette is optional ambience. Keep the scene stable while controls are focused/hovered and while hidden.

Four sample carriages have explicitly synthetic demo scores. Each browser can toggle one local demo vote per carriage; storage failures must not break the app. Public mode never reads demo counts. Fetch public counts only from configured GitHub issue reactions; null mappings display “Da attivare”, failures display an unavailable state, never zero. Voting itself occurs on GitHub. Contributions open a prefilled GitHub issue for user review; no upload or submission is claimed inside the demo.

Test ranking/ties, corrupted or blocked storage, invalid public data, failed requests, narrow layouts, touch and keyboard navigation, vote persistence and separation, dialogs, no-script content and reduced motion. Deliver source, setup docs and screenshots; do not claim deployment before it is verified.
