import {Plugin, MarkdownView, WorkspaceLeaf} from 'obsidian'

export default class PointAndClick extends Plugin {
	async onload() {
		console.log('Loaded & Ready')
        this.registerDomEvent(document, 'dblclick', (evt: MouseEvent) => {
            const target = evt.target as HTMLElement;
            if (this.isWhiteSpace(target)) {
                this.toggleView();
            }
        });
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