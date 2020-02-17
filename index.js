"use strict";
exports.__esModule = true;
var imaps = require("imap-simple");
var dotenv = require("dotenv");
dotenv.config();
var config = {
    imap: {
        user: process.env.email,
        password: process.env.password,
        host: process.env.host,
        port: parseInt(process.env.port),
        tls: process.env.tls === 'true' ? true : false
    }
};
imaps.connect(config).then(function (connection) {
    connection.openBox('INBOX').then(function () {
        // Fetch emails from the last 24h
        var delay = 24 * 3600 * 1000;
        var yesterday = new Date();
        yesterday.setTime(Date.now() - delay);
        var since = yesterday.toISOString();
        var searchCriteria = ['UNSEEN', ['SINCE', yesterday]];
        var fetchOptions = { bodies: ['HEADER.FIELDS (TO FROM SUBJECT)', 'TEXT'], struct: true, markSeen: true };
        // retrieve only the headers of the messages
        return connection.search(searchCriteria, fetchOptions);
    }).then(function (messages) {
        var attachments = [];
        messages.forEach(function (message) {
            var parts = imaps.getParts(message.attributes.struct);
            attachments = attachments.concat(parts.filter(function (part) {
                return part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT';
            }).map(function (part) {
                // retrieve the attachments only of the messages with attachments
                return connection.getPartData(message, part)
                    .then(function (partData) {
                    return {
                        filename: part.disposition.params.filename,
                        data: partData
                    };
                });
            }));
        });
        return Promise.all(attachments);
    }).then(function (attachments) {
        console.log(attachments);
        // =>
        //    [ { filename: 'cats.jpg', data: Buffer() },
        //      { filename: 'pay-stub.pdf', data: Buffer() } ]
    });
});
