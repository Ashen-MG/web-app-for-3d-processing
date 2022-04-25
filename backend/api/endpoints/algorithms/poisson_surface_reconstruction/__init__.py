from flask import request
from flask import current_app as app
from flasgger import SwaggerView
from endpoints.algorithms.poisson_surface_reconstruction.algorithm import poissonSurfaceReconstruction
from os.path import join as joinPath

class PoissonSurfaceReconstructionView(SwaggerView):
	def put(self):
		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]
		depth = request.json["depth"]

		nextVersion = currentVersion + 1
		nextVersionFileName = f"v{nextVersion}.{fileExtension}"

		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{currentVersion}.{fileExtension}")
		outputFilePath = joinPath(app.root_path, "static", "uploads", token, nextVersionFileName)

		kwargs = {} if depth is None else {"depth": depth}

		poissonSurfaceReconstruction(currentFilePath=currentFilePath, outputFilepath=outputFilePath, **kwargs)

		return {
			"fileExtension": fileExtension,
			"token": token,
			"version": nextVersion,
			"highestVersion": nextVersion
		}
