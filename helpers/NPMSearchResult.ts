import { ISlashCommandPreviewItem, SlashCommandPreviewItemType } from '@rocket.chat/apps-engine/definition/slashcommands';

export class NPMSearchResult {
    public name: string;
    public version: string;
    public description: string;
    public link: string;

    constructor(data?: any) {
        if (data) {
            this.name = data.name as string;
            this.version= data.version as string;
            this.description = data.description as string;
            if (data.links && data.links.npm) {
                this.link = data.links.npm as string;
            }
        }
    }
}
