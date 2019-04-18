const express = require('express');
const app = express();

require('dotenv').config();

const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const uploadDir = join(process.cwd(), 'images');
if (!existsSync(uploadDir)) mkdirSync(uploadDir);

app.use(require('express-fileupload'));
app.use('/images', express.static('images'));

app.post('/api/upload', (req, res) => {

	if (req.headers.authorization !== process.env.IMAGE_AUTH) {
		return res
			.status(401)
			.send({ code: 401, message: 'Invalid authentication credentials!' });
	}

	const { image } = req.files;
	const { id: filename, extension, error } = require('./handleImage')(image, res);
	if (!error) return res.send({ filename, extension });
});

const port = parseInt(process.env.PORT) || 4000;

app.listen(port, () => {
	console.log(`Serving on port ${port}!`);
});
