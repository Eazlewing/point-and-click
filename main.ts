import { Plugin, MarkdownView, WorkspaceLeaf } from 'obsidian';

export default class DoubleClickViewSwitchPlugin extends Plugin {
    private lastTap: number = 0;
    private tapTimeout: number = 300; // milliseconds

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
            if (leaf.getViewState().state.mode === 'source') {
                leaf.setViewState({ type: 'markdown', state: { mode: 'preview' } });
            } else {
                leaf.setViewState({ type: 'markdown', state: { mode: 'source' } });
            }
        }
    }
}