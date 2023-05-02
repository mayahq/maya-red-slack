const { Node, Schema, fields } = require('@mayahq/module-sdk');
const { WebClient } = require('@slack/web-api');
const SlackAuth = require('../slackAuth/slackAuth.schema');

const DST = ['str', 'msg', 'flow', 'global'];

class SendMessage extends Node {
	constructor(node, RED, opts) {
		super(node, RED, {
			...opts,
			// masterKey: 'You can set this property to make the node fall back to this key if Maya does not provide one'
		});
	}

	static schema = new Schema({
		name: 'send-message',
		label: 'Send Slack message',
		category: 'Slack',
		isConfig: false,
		fields: {
			auth: new fields.ConfigNode({ type: SlackAuth, useAlias: true }),
			sendBy: new fields.SelectFieldSet({
				// displayName: 'Send by',
				fieldSets: {
					name: {
						channelName: new fields.Typed({
							type: 'msg',
							allowedTypes: DST,
							defaultVal: 'payload.slackChannelName',
							displayName: 'Channel name',
						}),
					},
					ID: {
						channelId: new fields.Typed({
							type: 'msg',
							allowedTypes: DST,
							defaultVal: 'payload.slackChannelId',
							displayName: 'Channel ID',
						}),
					},
				},
			}),
			message: new fields.Typed({
				type: 'msg',
				allowedTypes: ['json', ...DST],
				defaultVal: 'payload.slackMessage',
				displayName: 'Message',
			}),
		},
	});

	onInit() {
		// Do something on initialization of node
	}

	async onMessage(msg, vals) {
		const web = new WebClient(this.credentials.auth.token);
		let channelId = null;

		if (vals.sendBy.selected === 'name') {
            msg.token = this.credentials.auth
            const channelName = vals.sendBy.childValues.channelName.replace('#', '')

			const channelsResult = await web.conversations.list();
            const targetChannel = channelsResult.channels.find(c => c.name === channelName)
            channelId = targetChannel.id
		} else {
            channelId = vals.sendBy.childValues.channelId
        }

        if (typeof vals.message === 'string') {
            await web.chat.postMessage({
                channel: channelId,
                text: vals.message
            })
        }

        return msg
	}
}

module.exports = SendMessage;
