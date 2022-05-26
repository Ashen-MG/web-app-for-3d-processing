from flask import request
from flask import current_app as app
from flasgger import SwaggerView, swag_from
from files import File

class UploadView(SwaggerView):

	@swag_from("post.yml")
	def post(self):
		# https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/

		if "file" not in request.files:
			return {"message": "Missing `file` parameter."}, 400

		file = File(request.files["file"], app.root_path, app.config["ALLOWED_EXTENSIONS"], app.config["SAVING_FOLDER"], app.config["EXPORTS_FOLDER"])

		if not file.isExtensionAllowed():
			return {"message": f"Invalid file extension. Supported extensions: {', '.join(app.config['ALLOWED_EXTENSIONS'])}"}, 400

		randomDirName: str = file.getRandomString()
		fileName, fileExtension = file.save(randomDirName, version=1)

		return {
			"fileExtension": fileExtension,
			"token": randomDirName,
			"version": 1,
			"highestVersion": 1
		}
