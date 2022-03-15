from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView
from endpoints.algorithms.remove_outliers.radius.algorithm import radiusOutlierRemoval
from os.path import join as joinPath

class RadiusOutlierRemovalView(SwaggerView):
	def put(self):
		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]
		numberOfPoints = request.json["numberOfPoints"]
		radius = request.json["radius"]

		nextVersion = currentVersion + 1
		nextVersionFileName = f"v{nextVersion}.{fileExtension}"

		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{currentVersion}.{fileExtension}")
		outputFilePath = joinPath(app.root_path, "static", "uploads", token, nextVersionFileName)

		radiusOutlierRemoval(currentFilePath=currentFilePath, outputFilepath=outputFilePath,
                         numberOfPoints=numberOfPoints, radius=radius)

		return {
			"file": {
				"url": url_for("static", filename=f"{app.config['UPLOADS_FOLDER']}/{token}/{nextVersionFileName}"),
				"extension": fileExtension
			},
			"token": token,
			"version": nextVersion,
		}