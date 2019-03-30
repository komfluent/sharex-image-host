// imports
const express = require('express');
const app = express();
const fileUploader = require('express-fileupload');
const handleImage = require('./handleImage');
const config = require('../password.json'); // TODO: Add an actual database for this. << this is trash.
const https = require('https');
const fs = require('fs');
const { join } = require('path');
// middleware
app.use(fileUploader());
//app.use('/images', express.static('images'));
app.use(
	'/images',
	express.static('images', { index: false, extensions: ['png'] })
);
// handle request
app.post('/api/upload', (req, res) => {
	// Test for auth
	if (req.headers.authorization !== config.password)
		return res
			.status(403)
			.send({ code: 403, message: 'invalid authentication credentials!' });
	const image = req.files.image;
	// write image to file
	const { id: filename, extension, error } = handleImage(image, res);
	// send response if no error
	if (!error) return res.send({ filename, extension });
	else console.log(error);
});

const port = process.env.PORT || 80;
https
	.createServer(
		{
			key: fs.readFileSync(join(process.cwd(), '/key.pem')),
			cert: fs.readFileSync(join(process.cwd(), '/cert.pem'))
		},
		app
	)
	.listen(443);
console.log('Server started!');
