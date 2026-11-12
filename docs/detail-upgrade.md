# Detailed carriage artwork

The user finds the current resolution too low to perceive detail. The cause is a 154 × 94 logical-pixel carriage and a canvas rendered at half CSS resolution. Raising backing resolution alone would preserve the same sparse artwork.

Implementer choice: retain the layout and four worlds, redraw the carriage artwork on a 616 × 376 design grid (four times each dimension), cache static drawings, and render the scene at device pixel density (capped at 3). Retain the existing world coordinates for navigation. Add a 1×/1.8× detail view centered on the selected carriage; pointer conversion must use the displayed zoom, not canvas backing size. Desktop/mobile and reduced-motion behavior remain intact.

Plan: write regression tests for sharp canvas dimensions, high-resolution thumbnails and selection while zoomed; observe failure; implement detailed cached artwork and separate world/backing dimensions; inspect screenshots at DPR 1/2/3; run all existing behavior tests; update the existing PR without changing main.

Art direction: metal seams/rivets and mechanical linkage, individual leaves/terracotta pots/glass reflections, books with spines and pages/interior lighting/rug, irregular stone pond edges/koi/maple branches, telescope hardware/star maps/lensed dome. No generated raster image or external asset dependency.
