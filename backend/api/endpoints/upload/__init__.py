from flask import request, url_for
from flask import current_app
from flasgger import SwaggerView
from config import UPLOADS_FOLDER
from files import File

class UploadView(SwaggerView):
	def post(self):
		# https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/

		if "file" not in request.files:  # TODO
			...

		file = File(current_app.root_path, request.files["file"])

		if not file.isExtensionAllowed():  # TODO
			...

		fileName = file.save()

		return {
			"fileURL": url_for("static", filename=f"{UPLOADS_FOLDER}/{fileName}")
		}