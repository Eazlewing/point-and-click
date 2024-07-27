import { Plugin, MarkdownView, WorkspaceLeaf } from 'obsidian';

export default class DoubleClickViewSwitchPlugin extends Plugin {
    private lastTap: number = 0;
    private tapTimeout: number = 300; // milliseconds
    private animationDuration: number = 2000; // milliseconds

    async onload() {
        this.registerDomEvent(document, 'dblclick', this.handleInteraction.bind(this));
        this.registerDomEvent(document, 'touchend', this.handleTouchEnd.bind(this));
    }

    handleInteraction(evt: MouseEvent | TouchEvent) {
        const target = evt.target as HTMLElement;
        if (this.isWhiteSpace(target)) {
            this.toggleView();
        }
    }

    handleTouchEnd(evt: TouchEvent) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this.lastTap;
        if (tapLength < this.tapTimeout && tapLength > 0) {
            this.handleInteraction(evt);
        }
        this.lastTap = currentTime;
    }

    isWhiteSpace(element: HTMLElement): boolean {
        return element.classList.contains('workspace-leaf-content') ||
               element.classList.contains('markdown-preview-view') ||
               element.classList.contains('cm-scroller');
    }

    toggleView() {
        const leaf = this.app.workspace.getActiveViewOfType(MarkdownView)?.leaf;
        if (leaf) {
            const currentMode = leaf.getViewState().state.mode;
            const newMode = currentMode === 'source' ? 'preview' : 'source';
            leaf.setViewState({ type: 'markdown', state: { mode: newMode } });
            this.showAnimatedIcon(newMode);
        }
    }

    showAnimatedIcon(mode: string) {
        const iconContainer = document.createElement('div');
        iconContainer.addClass('mode-switch-container');
        
        const iconElement = document.createElement('div');
        iconElement.addClass('mode-switch-icon');
        iconElement.innerHTML = mode === 'source' ? '✏️' : '👁️';
        
        const textElement = document.createElement('div');
        textElement.addClass('mode-switch-text');
        textElement.textContent = mode === 'source' ? 'Editing Mode' : 'Reading Mode';
        
        iconContainer.appendChild(iconElement);
        iconContainer.appendChild(textElement);
        
        document.body.appendChild(iconContainer);

        setTimeout(() => {
            iconContainer.addClass('fade-out');
            setTimeout(() => {
                iconContainer.remove();
            }, 500); // Matches the CSS transition time
        }, this.animationDuration);
    }
}