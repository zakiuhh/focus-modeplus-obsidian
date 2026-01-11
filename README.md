# Focus Mode Plus - Obsidian Plugin

Dims everything except the current paragraph to help you focus on what you're writing right now. Perfect for deep writing sessions!

## Features

🎯 **Paragraph Focus** - Only the current paragraph stays bright, everything else dims
⚙️ **Customizable Dimming** - Adjust opacity from 0% (invisible) to 100% (no dimming)
✨ **Smooth Transitions** - Configurable fade speed for smooth visual changes
🎨 **Custom Dim Colors** - Choose black, gray, or any color you prefer
🔘 **Easy Toggle** - Turn on/off with ribbon icon, command, or status bar
📊 **Status Indicator** - See if Focus Mode is active in the status bar

## How It Works

When Focus Mode is enabled:
- The paragraph where your cursor is remains **fully visible**
- Everything else (above and below) gets **dimmed**
- As you move your cursor, the focus **smoothly transitions** to the new paragraph
- Great for reducing visual clutter while writing!

## Installation

### Quick Install

1. Copy these files to `.obsidian/plugins/focus-mode-plus/`:
   - `main.js`
   - `manifest.json`
   - `styles.css`

2. Reload Obsidian
3. Enable "Focus Mode Plus" in Settings → Community Plugins

### Build from Source

1. Clone/download this repository
2. Navigate to the plugin folder:
   ```bash
   cd /path/to/vault/.obsidian/plugins/focus-mode-plus
   ```

3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

4. Reload Obsidian and enable the plugin

## Usage

### Toggle Focus Mode

**Three ways to activate:**

1. **Ribbon Icon** - Click the eye icon (👁️) in the left sidebar
2. **Command Palette** - Press `Ctrl/Cmd + P` and search "Toggle Focus Mode"
3. **Status Bar** - Check the bottom status bar to see if it's ON or OFF

### Customize Settings

Go to **Settings → Focus Mode Plus**:

**Dim Opacity** (0-100%)
- `0%` - Dimmed text is invisible
- `50%` - Balanced dimming (recommended)
- `100%` - No dimming at all

**Transition Speed** (0-1000ms)
- `0ms` - Instant dimming
- `200ms` - Smooth and quick (default)
- `500ms+` - Slower, more dramatic effect

**Dim Color**
- `#000000` - Black (default)
- `#333333` - Dark gray
- `#666666` - Medium gray
- Or enter any hex color code

## Tips & Best Practices

💡 **Recommended Settings:**
- Opacity: 30-50% for strong focus without losing context
- Transition: 200-300ms for smooth but not distracting
- Color: Black or dark gray for most themes

💡 **When to Use Focus Mode:**
- Writing long-form content
- Editing specific paragraphs
- Reducing distractions during deep work
- Reviewing and refining text section by section

💡 **Theme Compatibility:**
- Works with all Obsidian themes
- Adjust dim color based on your theme (dark themes may need lighter dim colors)

## Keyboard Shortcut

You can assign a custom hotkey to toggle Focus Mode:

1. Go to **Settings → Hotkeys**
2. Search for "Toggle Focus Mode"
3. Click the `+` icon and press your desired key combination
4. Save and use your shortcut!

## What is a "Paragraph"?

In Focus Mode Plus, a paragraph is defined as:
- A block of text separated by blank lines
- Multiple lines of continuous text count as one paragraph
- When you have a blank line, that starts a new paragraph

Example:
```
This is paragraph 1.
It can have multiple lines.
They all stay in focus together.

This is paragraph 2.
When you move here, paragraph 1 dims.
```

## Compatibility

- ✅ Works in Reading and Editing modes
- ✅ Compatible with all themes
- ✅ Works on Desktop and Mobile
- ✅ No conflicts with other plugins

## Privacy & Performance

- ✅ Runs 100% locally
- ✅ No data collected or sent anywhere
- ✅ Lightweight - minimal performance impact
- ✅ Doesn't modify your notes

## Troubleshooting

**Focus Mode doesn't seem to work:**
- Make sure the plugin is enabled in Community Plugins
- Check that the status bar shows "Focus Mode: ON"
- Try adjusting the dim opacity (maybe it's set to 100%)

**Dimming is too strong/weak:**
- Adjust the "Dim opacity" slider in settings
- Lower values = stronger dimming
- Higher values = weaker dimming

**Transitions are too slow/fast:**
- Adjust the "Transition speed" in settings
- Lower values = faster transitions
- Higher values = slower, more dramatic effects

## Changelog

### v1.0.0
- 🎉 Initial release
- Paragraph-based focus mode
- Customizable dimming opacity
- Adjustable transition speed
- Custom dim colors
- Ribbon icon toggle
- Command palette support
- Status bar indicator

## Future Ideas

- Line-based focus option
- Multiple paragraph focus
- Focus by heading level
- Typewriter mode integration
- Zen mode (full screen + focus)

## Support

Love this plugin? 
- ⭐ Star the repository
- 🐛 Report bugs via issues
- 💡 Suggest features
- ☕ Buy me a coffee (optional!)

## License

MIT License - Free to use and modify!

---

Made with ❤️ for focused writing
