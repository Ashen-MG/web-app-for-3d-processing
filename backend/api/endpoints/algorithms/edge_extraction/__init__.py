from flask import request
from flask import current_app as app
from flasgger import SwaggerView
from endpoints.algorithms.edge_extraction.algorithm import edgeExtraction
from os.path import join as joinPath

class EdgeExtractionView(SwaggerView):
	def put(self):
		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]
		featureAngle = request.json["featureAngle"]

		nextVersion = currentVersion + 1
		nextVersionFileName = f"v{nextVersion}.{fileExtension}"

		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{currentVersion}.{fileExtension}")
		outputFilePath = joinPath(app.root_path, "static", "uploads", token, nextVersionFileName)

		kwargs = {} if featureAngle is None else {"featureAngle": featureAngle}

		edgeExtraction(currentFilePath=currentFilePath, outputFilepath=outputFilePath, **kwargs)

		return {
			"fileExtension": fileExtension,
			"token": token,
			"version": nextVersion,
			"highestVersion": nextVersion
		}
