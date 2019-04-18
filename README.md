# sharex-image-host

Minimal ShareX image host written in js using express and express-fileupload.

## Installation

`npm i` to install dependencies

`node .` to run the server

## Configuration

Config is stored in .env

Example:

```env
PORT="1337" # port to run the application on
IMAGE_AUTH="yourpassword" # password protection for image upload and deletion. You can also have multiple users like this: IMAGE_AUTH="yourpassword, yourfriendspassword"
```

## Usage

### `POST /upload`

Headers: `Authorization: YOUR_PASSWORD`

Form-data: `image: THE_IMAGE`

Response: 200

```json
{
	"filename": "example.png"
}
```

> After that, the image will be available at yourdomain.com/i/:filename

---

### `DELETE /:image`

Headers: `Authorization: YOUR_PASSWORD`

Response: 204
