const fs = require('fs');
module.exports = (image, res) => {
	const extension = image.name.split('.')[1];
	const id = new Date.getTime().toString(36);
	const error = false;
	fs.writeFile(`./images/${id}.${extension}`, image.data, err =>
		err
			? (() => {
					res
						.status(500)
						.send({ code: 500, message: 'Failed to save file to folder' });
					error = true;
			  })()
			: {}
	);

	return { id, extension, error };
};
