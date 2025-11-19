**Project: tmux Pane Simulator**

Single HTML file web app that mimics tmux pane splitting behavior:

**Requirements:**
- Each pane has buttons to split horizontally (─) or vertically (│)
- Mouse resizing by dragging dividers between panes (like `set -g mouse on` in tmux)
- All code (HTML, CSS, JS/React) in one file
- Simple, minimal implementation

**Current state:**
- Built with React (via CDN)
- Panes split 50/50 on creation
- Mouse resizing works for both directions
- Active pane highlighted with green border

**Issues fixed:**
1. React `.map()` error - added children check before useState
2. Vertical resizing used wrong dimensions - now uses actual container size
3. Splits not taking 50% - added proper flex wrapper

The app is working. Copy the latest HTML code if continuing development.
