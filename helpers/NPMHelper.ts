import { HttpStatusCode, IHttp, ILogger } from '@rocket.chat/apps-engine/definition/accessors';

import { NPMSearchResult } from './NPMSearchResult';

export class NPMHelper {
    private readonly url = 'https://www.npmjs.com/search/suggestions?q=';

    public async search(logger: ILogger, http: IHttp, phase: string): Promise<Array<NPMSearchResult>> {
        let search = phase.trim();
        if (!search) {
            search = 'random';
        }

        const response = await http.get(`${this.url}${search}&size=10`, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.statusCode !== HttpStatusCode.OK || !response.data) {
            logger.debug('Did not get a valid response', response);
            throw new Error('Unable to retrieve npm modules.');
        } else if (!Array.isArray(response.data)) {
            logger.debug('The response data is not an Array:', response.data.data);
            throw new Error('Data is in a format we don\'t understand.');
        }

        logger.debug('We got this many results:', response.data.length);

        return response.data.map((r) => new NPMSearchResult(r));
    }

    public async parse(results: Array<NPMSearchResult>): Promise<string> {
        if (!results.length) {
            return '';
        }
        return results.reduce((acc, result) => {
            const name = result.link ? `[\`${result.name}\`](${result.link})` : `\`${result.name}\``;
            return `${acc}${name} *@${result.version}* : ${result.description}\n`;
        }, '');
    }
}
