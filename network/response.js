const send_webhook = require('./send_webhook');
const wenHookTool = require("../Web_hook_tools/buildMessagesWebHookTool.js");
const logger = require("./logger.js")

function success(req, res, message, status) {

    try {

        res.status(status || 200).send({
            error: '',
            data: message
        });

    } catch (err) {
        return err;
    }

}

function error(req, res, errorMessage, status, errorDetails) {
    logger.error('[response error]: ' + errorDetails);
    res.status(status || 500).send({
        error: errorMessage,
        data: JSON.stringify(errorDetails)
    });
}

function msgSlack(message, testParams) {
    const { slack: slackWebHook } = testParams;
    if (message.summary) {
        const formatParameters = wenHookTool.setParameters(message, testParams);
        const slackTextBody = wenHookTool.textSlack(formatParameters);
        send_webhook.slack_send_msg(slackTextBody, slackWebHook);
    } else {
        send_webhook.slack_send_msg(message, slackWebHook);
    }

}
//casslos
async function msgTeams(message, testParams) {

    if (message.summary) {
        const formatParameters = wenHookTool.setParameters(message, testParams);
        const msTemsTextBody = wenHookTool.textMsTeams(formatParameters);
        send_webhook.msTeams_send_msg(msTemsTextBody);
    } else {
        const msTemsTextBody = wenHookTool.msTeamBody("xx",message,"");
        send_webhook.msTeams_send_msg(msTemsTextBody);
    }

}

module.exports = {
    msgSlack,
    msgTeams,
    success,
    error
}
