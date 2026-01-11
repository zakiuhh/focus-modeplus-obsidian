import { App, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { EditorView, ViewPlugin, ViewUpdate, Decoration, DecorationSet } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';

interface FocusModeSettings {
	enabled: boolean;
	dimOpacity: number;
	fadeSpeed: number;
	dimColor: string;
}

const DEFAULT_SETTINGS: FocusModeSettings = {
	enabled: false,
	dimOpacity: 50,
	fadeSpeed: 200,
	dimColor: '#000000'
}

export default class FocusModePlusPlugin extends Plugin {
	settings: FocusModeSettings;
	statusBarItem: HTMLElement;

	async onload() {
		await this.loadSettings();

		// Add status bar item
		this.statusBarItem = this.addStatusBarItem();
		this.updateStatusBar();

		// Register the editor extension
		this.registerEditorExtension(this.createFocusExtension());

		// Add command to toggle focus mode
		this.addCommand({
			id: 'toggle-focus-mode',
			name: 'Toggle Focus Mode',
			callback: () => {
				this.settings.enabled = !this.settings.enabled;
				this.saveSettings();
				this.updateStatusBar();
			}
		});

		// Add ribbon icon
		this.addRibbonIcon('eye', 'Toggle Focus Mode', () => {
			this.settings.enabled = !this.settings.enabled;
			this.saveSettings();
			this.updateStatusBar();
		});

		// Add settings tab
		this.addSettingTab(new FocusModeSettingTab(this.app, this));

		console.log('Focus Mode Plus plugin loaded');
	}

	onunload() {
		console.log('Focus Mode Plus plugin unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.app.workspace.updateOptions();
	}

	updateStatusBar() {
		if (this.settings.enabled) {
			this.statusBarItem.setText('👁️ Focus Mode: ON');
			this.statusBarItem.addClass('focus-mode-active');
		} else {
			this.statusBarItem.setText('👁️ Focus Mode: OFF');
			this.statusBarItem.removeClass('focus-mode-active');
		}
	}

	createFocusExtension() {
		const plugin = this;
		
		return ViewPlugin.fromClass(class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.selectionSet || update.viewportChanged) {
					this.decorations = this.buildDecorations(update.view);
				}
			}

			buildDecorations(view: EditorView): DecorationSet {
				// If focus mode is disabled, return empty decorations
				if (!plugin.settings.enabled) {
					return Decoration.set([]);
				}

				const decorations: any[] = [];
				const doc = view.state.doc;
				const selection = view.state.selection.main;
				const cursorPos = selection.head;

				// Find the current paragraph (block of text separated by blank lines)
				let paragraphStart = cursorPos;
				let paragraphEnd = cursorPos;

				// Find paragraph start (go backwards until blank line or start of doc)
				while (paragraphStart > 0) {
					const line = doc.lineAt(paragraphStart);
					const prevLine = paragraphStart > line.from ? doc.lineAt(line.from - 1) : null;
					
					// If we hit the start or a blank line, we found the paragraph start
					if (!prevLine || prevLine.text.trim() === '') {
						paragraphStart = line.from;
						break;
					}
					
					paragraphStart = line.from - 1;
				}

				// Find paragraph end (go forwards until blank line or end of doc)
				while (paragraphEnd < doc.length) {
					const line = doc.lineAt(paragraphEnd);
					const nextLine = paragraphEnd < line.to ? doc.lineAt(line.to + 1) : null;
					
					// If we hit the end or a blank line, we found the paragraph end
					if (!nextLine || nextLine.text.trim() === '') {
						paragraphEnd = line.to;
						break;
					}
					
					paragraphEnd = line.to + 1;
				}

				// Calculate opacity and color for dimming
				const opacity = plugin.settings.dimOpacity / 100;
				const dimColor = plugin.settings.dimColor;
				const rgb = this.hexToRgb(dimColor);
				const dimStyle = `color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}); transition: color ${plugin.settings.fadeSpeed}ms ease;`;

				// Dim everything before the current paragraph
				if (paragraphStart > 0) {
					for (let { from, to } of view.visibleRanges) {
						const dimStart = Math.max(from, 0);
						const dimEnd = Math.min(to, paragraphStart);
						
						if (dimEnd > dimStart) {
							decorations.push(
								Decoration.mark({
									attributes: { style: dimStyle }
								}).range(dimStart, dimEnd)
							);
						}
					}
				}

				// Dim everything after the current paragraph
				if (paragraphEnd < doc.length) {
					for (let { from, to } of view.visibleRanges) {
						const dimStart = Math.max(from, paragraphEnd);
						const dimEnd = Math.min(to, doc.length);
						
						if (dimEnd > dimStart) {
							decorations.push(
								Decoration.mark({
									attributes: { style: dimStyle }
								}).range(dimStart, dimEnd)
							);
						}
					}
				}

				return Decoration.set(decorations);
			}

			hexToRgb(hex: string): { r: number, g: number, b: number } {
				// Remove # if present
				hex = hex.replace('#', '');
				
				// Parse hex values
				const r = parseInt(hex.substring(0, 2), 16);
				const g = parseInt(hex.substring(2, 4), 16);
				const b = parseInt(hex.substring(4, 6), 16);
				
				return { r, g, b };
			}
		}, {
			decorations: v => v.decorations
		});
	}
}

class FocusModeSettingTab extends PluginSettingTab {
	plugin: FocusModePlusPlugin;

	constructor(app: App, plugin: FocusModePlusPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Focus Mode Plus Settings' });

		// Enable/Disable toggle
		new Setting(containerEl)
			.setName('Enable Focus Mode')
			.setDesc('Dim everything except the current paragraph')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enabled)
				.onChange(async (value) => {
					this.plugin.settings.enabled = value;
					await this.plugin.saveSettings();
					this.plugin.updateStatusBar();
				}));

		// Dim opacity slider
		new Setting(containerEl)
			.setName('Dim opacity')
			.setDesc('How much to dim unfocused text (0 = invisible, 100 = no dimming)')
			.addSlider(slider => slider
				.setLimits(0, 100, 5)
				.setValue(this.plugin.settings.dimOpacity)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.dimOpacity = value;
					await this.plugin.saveSettings();
				}));

		// Fade speed
		new Setting(containerEl)
			.setName('Transition speed')
			.setDesc('How fast the dimming effect transitions (in milliseconds)')
			.addSlider(slider => slider
				.setLimits(0, 1000, 50)
				.setValue(this.plugin.settings.fadeSpeed)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.fadeSpeed = value;
					await this.plugin.saveSettings();
				}));

		// Dim color
		new Setting(containerEl)
			.setName('Dim color')
			.setDesc('Color to use for dimming (works best with dark colors)')
			.addText(text => text
				.setPlaceholder('#000000')
				.setValue(this.plugin.settings.dimColor)
				.onChange(async (value) => {
					// Validate hex color
					if (/^#[0-9A-F]{6}$/i.test(value)) {
						this.plugin.settings.dimColor = value;
						await this.plugin.saveSettings();
					}
				}));

		// Color presets
		containerEl.createEl('h3', { text: 'Color Presets' });
		
		const presetContainer = containerEl.createDiv({ cls: 'color-preset-container' });
		presetContainer.style.display = 'flex';
		presetContainer.style.gap = '10px';
		presetContainer.style.flexWrap = 'wrap';

		const colorPresets = [
			{ name: 'Black', color: '#000000' },
			{ name: 'Dark Gray', color: '#333333' },
			{ name: 'Medium Gray', color: '#666666' },
			{ name: 'Light Gray', color: '#999999' }
		];

		colorPresets.forEach(preset => {
			const presetButton = presetContainer.createEl('button', { text: preset.name });
			presetButton.style.backgroundColor = preset.color;
			presetButton.style.color = '#ffffff';
			presetButton.style.padding = '8px 16px';
			presetButton.style.border = 'none';
			presetButton.style.borderRadius = '4px';
			presetButton.style.cursor = 'pointer';
			presetButton.addEventListener('click', async () => {
				this.plugin.settings.dimColor = preset.color;
				await this.plugin.saveSettings();
				this.display();
			});
		});

		// Usage instructions
		containerEl.createEl('h3', { text: 'How to Use' });
		const instructions = containerEl.createEl('div', { cls: 'focus-mode-instructions' });
		instructions.innerHTML = `
			<p><strong>Toggle Focus Mode:</strong></p>
			<ul>
				<li>Click the eye icon (👁️) in the left ribbon</li>
				<li>Use the command palette: "Toggle Focus Mode"</li>
				<li>Check the status bar at the bottom</li>
			</ul>
			<p><strong>Tips:</strong></p>
			<ul>
				<li>Lower opacity = stronger dimming effect</li>
				<li>Higher transition speed = smoother animations</li>
				<li>Dark dim colors work best with light themes</li>
				<li>Try opacity around 30-50% for best readability</li>
			</ul>
		`;
	}
}
