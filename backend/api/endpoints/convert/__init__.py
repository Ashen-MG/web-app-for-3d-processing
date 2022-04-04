from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView
from files import File
from convert import createConversions
from os.path import join as joinPath
import json

class ConvertView(SwaggerView):
	def post(self):
		if "file" not in request.files:  # TODO
			...

		file = File(app.root_path, request.files["file"])
		convertTypes = json.loads(request.form["convertTypes"])

		if not file.isExtensionAllowed():  # TODO
			...

		token: str = file.getRandomString()
		fileName, fileExtension = file.save(token, version=1)

		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{1}.{fileExtension}")
		exportPath = joinPath(app.root_path, "static", "exports", token)
		createConversions(currentFilePath, exportPath, convertTypes)
		# TODO: clean up of uploads
		return {
			"fileURL": url_for("static", filename=f"exports/{token}/converted.zip")
		}
