const {
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')

class SlackAuth extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {
            ...opts,
            // masterKey: 'You can set this property to make the node fall back to this key if Maya does not provide one'
        })
    }

    static schema = new Schema({
        name: 'slack-auth',
        label: 'slack-auth',
        category: 'config',
        isConfig: true,
        fields: {
            // Whatever custom fields the node needs.
        },
        redOpts: {
            credentials: {
                token: new fields.Credential({ type: "str", password: true }),
            },
        }

    })

    onInit() {
        // Do something on initialization of node
    }

    async onMessage(msg, vals) {
        // Handle the message. The returned value will
        // be sent as the message to any further nodes.

    }
}

module.exports = SlackAuth