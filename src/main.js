const express = require('express');
const app = express();

require('dotenv').config();

const { existsSync, mkdirSync, writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');

const port = parseInt(process.env.PORT) || 4000;

const uploadDir = join(process.cwd(), 'images');
if (!existsSync(uploadDir)) {
	console.log('Created /images');
	mkdirSync(uploadDir);
}

function handleImage(image, res) {
	const extension = image.name.split('.')[1];
	const id = new Date().getTime().toString(36) + '.' + extension;
	writeFileSync(`./images/${id}`, image.data);
	console.log(`+ ${id} (${image.name})`);
	return { id };
}

app.use(require('express-fileupload')());
app.use('/', express.static('images'));

app.get('/', (req, res) => {
	return res
		.status(404)
		.send({ code: 404, message: 'Cannot GET /. Use POST /upload for image uploading.'})
});

app.post('/upload', (req, res) => {

	if (req.headers.authorization !== process.env.IMAGE_AUTH) {
		return res
			.status(401)
			.send({ code: 401, message: 'Invalid authentication credentials!' });
	}

	const { image } = req.files;
	const { id: filename } = handleImage(image, res);
	if (filename) return res.send({ filename });
	return res
		.status(500)
		.send({ code: 500, message: 'Internal server error.' });
});

app.delete('/:file', (req, res) => {

	if (req.headers.authorization !== process.env.IMAGE_AUTH) {
		return res
			.status(401)
			.send({ code: 401, message: 'Invalid authentication credentials!' });
	}

	const { file } = req.params;

	unlinkSync(join(process.cwd(), 'images', file));
	console.log(`- ${file}`);

	return res
		.status(204)
		.send({ code: 204, message: `Successfully deleted ${file}.` })

}) 

app.listen(port, () => {
	console.log(`Serving on port ${port}!`);
});
