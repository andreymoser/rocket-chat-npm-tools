import {
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { NPMCommand } from './commands/NPMCommand';
import { NPMHelper } from './helpers/NPMHelper';

export class NPMToolsApp extends App {
    private npmHelper: NPMHelper;
    
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);

        this.npmHelper = new NPMHelper();
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(new NPMCommand(this));
    }

    public getNPMHelper(): NPMHelper {
        return this.npmHelper;
    }
}
