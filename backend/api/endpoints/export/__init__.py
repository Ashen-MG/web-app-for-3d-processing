from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView, swag_from
from convert import createConversions
from os.path import join as joinPath

class ExportView(SwaggerView):

	@swag_from("post.yml")
	def post(self):
		if not request.json:
			return {"message": "Missing JSON parameters."}, 400
		for p in ["token", "version", "fileExtension", "convertTypes"]:
			if p not in request.json:
				return {"message": f"Missing `{p}` parameter."}, 400

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
