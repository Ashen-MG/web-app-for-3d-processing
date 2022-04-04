from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView
from files import File

class PreviousVersion(SwaggerView):
	def put(self):
		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]

		if currentVersion <= 1:
			return 400, "No previous version found."

		return {
			"file": {
				"url": url_for("static", filename=f"{app.config['UPLOADS_FOLDER']}/{token}/{fileName}"),
				"extension": fileExtension
			},
			"token": token,
			"version": currentVersion - 1,
		}
