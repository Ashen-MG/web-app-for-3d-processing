from flask import request, url_for
from flask import current_app as app
from flasgger import SwaggerView
from endpoints.algorithms.voxel_downsampling.algorithm import voxelDownsampling
from os.path import join as joinPath

class VoxelDownsamplingView(SwaggerView):
	def put(self):
		token = request.json["token"]
		currentVersion = request.json["version"]
		fileExtension = request.json["fileExtension"]
		voxelSize = request.json["voxelSize"]

		nextVersion = currentVersion + 1
		nextVersionFileName = f"v{nextVersion}.{fileExtension}"

		# TODO: create path
		currentFilePath = joinPath(app.root_path, "static", "uploads", token, f"v{currentVersion}.{fileExtension}")
		outputFilePath = joinPath(app.root_path, "static", "uploads", token, nextVersionFileName)

		voxelDownsampling(currentFilePath=currentFilePath, outputFilepath=outputFilePath, voxelSize=voxelSize)

		return {
			"file": {
				"url": url_for("static", filename=f"{app.config['UPLOADS_FOLDER']}/{token}/{nextVersionFileName}"),
				"extension": fileExtension
			},
			"token": token,
			"version": nextVersion,
			"highestVersion": nextVersion
		}