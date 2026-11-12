# Inhabited worlds, visual detail revision

The user explicitly requested the resolution/detail level of Floor796. A direct inspection of https://floor796.com/ shows a dense inhabited world, very different from the sparse procedural carriage icons. The reference is for density, character scale, spatial depth and discoverability, not for copying its rooms or assets.

Implementation decision: replace the five primary carriage/engine sprites with original high-resolution transparent illustrations. Keep the procedural version as a network-error fallback. Preserve the train's horizontal coupling and shared teal/brass shell. Each interior contains people engaged in distinct tasks, coherent perspective, numerous functional objects and small stories. The images were generated using the built-in image tool with the library as the structural reference for the other four. The prompts are recorded in assets/README.md.

The room illustrations and their inhabitants are static. Landscape and steam remain animated. This revision must not be presented as hand-pixelled frame-by-frame animation or as reproducing Floor796's whole animated world.

Plan: test sprite loading and explicit failure states; integrate decoded image cache and refresh canvas/previews after loading; add a native-resolution detail viewer with zoom/pan and accessible dialog controls; enlarge scene framing on desktop; preserve touch/keyboard/vote behavior; check screenshot detail and image transparency; run the suite and update the existing PR. Main is unchanged.
