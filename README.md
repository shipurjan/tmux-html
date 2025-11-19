# Tmux Pane Simulator

Tmux-style pane manager in a single HTML file. Split, resize, and delete panes with mouse support. No build required - just open in browser.

## Usage

Open `tmux.html` in a browser. Click panes to activate, use `+` buttons to split, drag dividers to resize, click `×` to delete.

Click the top bar (`~ tmux`) for root mode - adds panes at viewport edges to reorganize the entire layout.

## Technical

Single HTML file with React (CDN), recursive tree structure, UUID-based panes. Check browser console for debug logs.

## License

MIT
