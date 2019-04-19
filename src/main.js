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
	const id = new Date().getTime().toString(36);
	writeFileSync(join(uploadDir, `${id}.${extension}`), image.data);
	console.log(`+ ${id} (${image.name})`);
	return { id };
}

app.use(require('./logging'));
app.use(require('express-fileupload')());

app.get('/', (req, res) => {
	return res.status(404).send({
		code: 404,
		message: 'Cannot GET /. Use POST /upload for image uploading.'
	});
});

app.get('/i/:id', (req, res) => {
	const files = fs.readdirSync(join(process.cwd(), '/images'));
	const file = files.find(el => el.startsWith(req.params.id));
	if (file) {
		res.sendFile(join(process.cwd(), 'images', file));
		if (req.query.download) {
			res.download(join(process.cwd(), 'images', file));
		}
	} else {
		return res.status(404).send({
			code: 404,
			message: `Cannot GET /i/${
				req.params.id
			}. Use POST /upload for image uploading.`
		});
	}
});

app.post('/upload', (req, res) => {
	if (
		process.env.IMAGE_AUTH.split(', ').some(
			password => password === req.get('authorization')
		)
	) {
		const { image } = req.files;
		const { id: filename } = handleImage(image, res);
		if (filename)
			return (() => {
				res.send({ filename });
				res.imageID = filename;
			})();
		return res
			.status(500)
			.send({ code: 500, message: 'Internal server error.' });
	} else {
		return res
			.status(401)
			.send({ code: 401, message: 'Invalid authentication credentials!' });
	}
});

app.delete('/:file', (req, res) => {
	if (
		process.env.IMAGE_AUTH.split(', ').some(
			password => password === req.get('authorization')
		)
	) {
		const { file } = req.params;

		unlinkSync(join(process.cwd(), 'images', file));
		console.log(`- ${file}`);

		return res
			.status(204)
			.send({ code: 204, message: `Successfully deleted ${file}.` });
	} else {
		return res
			.status(401)
			.send({ code: 401, message: 'Invalid authentication credentials!' });
	}
});

app.listen(port, () => {
	console.log(`Serving on port ${port}!`);
});
