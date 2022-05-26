from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView, swag_from
from files import File
from convert import createConversions
from os.path import join as joinPath
import json

class ConvertView(SwaggerView):

	@swag_from("post.yml")
	def post(self):
		if "file" not in request.files:
			return {"message": "Missing `file` parameter."}, 400
		if "convertTypes" not in request.form:
			return {"message": "Missing `convertTypes` parameter."}, 400

		file = File(request.files["file"], app.root_path, app.config["ALLOWED_EXTENSIONS"], app.config["SAVING_FOLDER"], app.config["EXPORTS_FOLDER"])
		convertTypes = json.loads(request.form["convertTypes"])

		if not file.isExtensionAllowed():
			return {"message": f"Invalid file extension. Supported extensions: {', '.join(app.config['ALLOWED_EXTENSIONS'])}"}, 400

		token: str = file.getRandomString()
		fileName, fileExtension = file.save(token, version=1)

		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v1.{fileExtension}")
		exportPath = joinPath(app.root_path, "static", "exports", token)

		createConversions(currentFilePath, exportPath, convertTypes)

		return {
			"fileURL": url_for("static", filename=f"exports/{token}/converted.zip")
		}
