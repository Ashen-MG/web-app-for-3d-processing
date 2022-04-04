from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView
from convert import createConversions
from os.path import join as joinPath

class ExportView(SwaggerView):
	def post(self):
		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]
		convertTypes = request.json["convertTypes"]
		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{currentVersion}.{fileExtension}")
		exportPath = joinPath(app.root_path, "static", "exports", token)
		createConversions(currentFilePath, exportPath, convertTypes)
		return {
			"fileURL": url_for("static", filename=f"exports/{token}/converted.zip")
		}
