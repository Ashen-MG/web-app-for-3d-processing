from flask import request
from flask import current_app as app
from flasgger import SwaggerView, swag_from
from os.path import join as joinPath, exists as fileExists
from typing import Tuple, Callable

class AlgorithmView(SwaggerView):
	""" Generalized endpoint view for available algorithms within the API. """

	def __init__(self, algorithmFunction: Callable[[str, str, tuple], Tuple[bool, str]], *algorithmParameters):
		super().__init__()
		self.algorithmsParameters = algorithmParameters
		self.algorithmFunction = algorithmFunction
		self.requestParameters = ["token", "version", "fileExtension"] + list(algorithmParameters)

	@swag_from("/algorithms/voxel_downsampling/put.yml", endpoint="voxel_downsampling")
	@swag_from("/algorithms/poisson_sampling/put.yml", endpoint="poisson_sampling")
	@swag_from("/algorithms/fixed_sampling/put.yml", endpoint="fixed_sampling")
	@swag_from("/algorithms/edge_extraction/put.yml", endpoint="edge_extraction")
	@swag_from("/algorithms/poisson_surface_reconstruction/put.yml", endpoint="poisson_surface_reconstruction")
	@swag_from("/algorithms/remove_outliers/statistical/put.yml", endpoint="statistical_outlier_removal")
	@swag_from("/algorithms/remove_outliers/radius/put.yml", endpoint="radius_outlier_removal")
	@swag_from("/algorithms/ml/sharpen_point_cloud/put.yml", endpoint="ml_sharpen_point_cloud")
	@swag_from("/algorithms/ml/sharpen_point_cloud_edges/put.yml", endpoint="ml_sharpen_point_cloud_edges")
	def put(self):
		if not request.json:
			return {"message": "Missing JSON parameters."}, 400
		for p in self.requestParameters:
			if p not in request.json:
				return {"message": f"Missing `{p}` parameter."}, 400

		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]

		nextVersion = currentVersion + 1
		nextVersionFileName = f"v{nextVersion}.{fileExtension}"

		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{currentVersion}.{fileExtension}")
		outputFilePath = joinPath(app.root_path, "static", "uploads", token, nextVersionFileName)

		if not fileExists(currentFilePath):
			return {"message": "File doesn't exist."}, 404

		success, message = self.algorithmFunction(
			currentFilePath,
			outputFilePath,
			*[request.json[p] for p in self.algorithmsParameters]
		)

		if not success:
			return {"message": message}, 400

		return {
			"fileExtension": fileExtension,
			"token": token,
			"version": nextVersion,
			"highestVersion": nextVersion
		}
