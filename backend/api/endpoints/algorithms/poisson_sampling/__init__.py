from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView
from endpoints.algorithms.poisson_sampling.algorithm import poissonSampling
from os.path import join as joinPath

class PoissonSamplingView(SwaggerView):
	def put(self):
		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]
		numberOfPoints = request.json["numberOfPoints"]

		nextVersion = currentVersion + 1
		nextVersionFileName = f"v{nextVersion}.{fileExtension}"

		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{currentVersion}.{fileExtension}")
		outputFilePath = joinPath(app.root_path, "static", "uploads", token, nextVersionFileName)

		poissonSampling(currentFilePath=currentFilePath, outputFilepath=outputFilePath, numberOfPoints=numberOfPoints)

		return {
			"fileExtension": fileExtension,
			"token": token,
			"version": nextVersion,
			"highestVersion": nextVersion
		}