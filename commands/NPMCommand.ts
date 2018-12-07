import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext, SlashCommandPreviewItemType } from '@rocket.chat/apps-engine/definition/slashcommands';

import { NPMToolsApp } from '../NPMToolsApp';

export class NPMCommand implements ISlashCommand {
    public command: string;
    public i18nParamsExample: string;
    public i18nDescription: string;
    public providesPreview: boolean;

    constructor(private readonly app: NPMToolsApp) {
        this.command = 'npm';
        this.i18nParamsExample = 'NPMCommands_params_examples';
        this.i18nDescription = 'NPMCommands_description';
        this.providesPreview = false;
    }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const builder = modify.getCreator().startMessage().setSender(context.getSender()).setRoom(context.getRoom());
        try {
            const query = context.getArguments().join(' ');
            const npmSearchResults = 
                await this.app.getNPMHelper().search(this.app.getLogger(), http, query);
            let text = '';
            if (npmSearchResults && npmSearchResults.length) {
                text = await this.app.getNPMHelper().parse(npmSearchResults);
            } else {
                //TODO find i18n utility to use (not found on Rocket.chat docs)
                text = `*No modules founds for* \`${query}\``;
            }
            builder.setText(text);
        } catch (e) {
            builder.setText('An error occured when trying to search on npm :disappointed_relieved:');
        }
        await modify.getCreator().finish(builder);
    }

}
