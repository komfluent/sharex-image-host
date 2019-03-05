// imports
const express = require('express');
const app = express();
const fileUploader = require('express-fileupload');
const handleImage = require('./handleImage');
const config = require('../password.json'); // TODO: Add an actual database for this. << this is trash.

// middleware
app.use(fileUploader());
app.use('/images', express.static('images'));

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
});

const port = process.env.PORT || 80;

app.listen(port, () => {
	console.log(`Server started on port http://localhost:${port}!`);
});
