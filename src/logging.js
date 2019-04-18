const { request, response } = require('express');
/**
 *
 * @param {request} req The request object for an express request
 * @param {response} res The response object for an express request
 */
module.exports = function log(req, res, next) {
	next();
	const isUpload = req.url.split('/').includes('upload');
	res.addListener('finish', () => {
		console.log(
			`New request from ${
				req.ip.split(':')[req.ip.split(':').length - 1]
			} at ${new Date().toLocaleString('en-US', {
				timeZone: 'America/Phoenix'
			})}: ${req.method} ${req.url} ${req.httpVersion} | Response: ${
				res.statusCode
			} ${res.statusMessage} | ${
				isUpload
					? `Returned ID: ${res.imageID}`
					: `Queried Image: ${
							req.params
								? req.params.id || 'no image with that id'
								: 'invalid url'
					  }`
			}`
		);
	});
};
