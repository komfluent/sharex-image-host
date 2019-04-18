# sharex-image-host
Basic sharex image host written in js with express and express-uploader.

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

### `DELETE /:image`
Headers: `Authorization: YOUR_PASSWORD`

Response: 204

## Configuration
Config is stored in .env

Example:

```env
PORT="1337" # port to run the application on
IMAGE_AUTH="yourpassword" # password protection for image upload and deletion
```

