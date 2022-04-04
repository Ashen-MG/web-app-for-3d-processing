from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView
from files import File

class UploadView(SwaggerView):
	def post(self):
		# https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/

		if "file" not in request.files:  # TODO
			...

		file = File(app.root_path, request.files["file"])

		if not file.isExtensionAllowed():  # TODO
			...

		randomDirName: str = file.getRandomString()
		fileName, fileExtension = file.save(randomDirName, version=1)

		return {
			"file": {
				"url": url_for("static", filename=f"{app.config['UPLOADS_FOLDER']}/{randomDirName}/{fileName}"),
				"extension": fileExtension
			},
			"token": randomDirName,
			"version": 1,
		}
