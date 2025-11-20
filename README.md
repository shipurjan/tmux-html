# Tmux Pane Simulator

Tmux-style pane manager in a single HTML file. Split, resize, and delete panes with mouse support. No build required - just open in browser.

https://shipurjan.github.io/tmux-html/

## Usage

There are two clickable elements:

**Panes** (the colored areas):
- Click a pane to activate it and show 2 split buttons (`+`)
- Bottom button: split horizontally (add pane below)
- Right button: split vertically (add pane to right)
- Click `×` button to delete pane (disabled if only one pane remains)

**Separators** (the gray dividers between panes):
- Click a separator to activate its container and show 4 edge buttons (`+`)
- Top/bottom buttons: add pane above/below the entire container
- Left/right buttons: add pane to left/right of the entire container
- Drag separators to resize (does not activate container)

## Technical

Single HTML file with React (CDN), recursive tree structure, UUID-based nodes. Containers activatable via separator clicks. Check browser console for debug logs.

## License

MIT
