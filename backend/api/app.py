import base64
import os
import re
import zipfile
from typing import Dict
from shutil import copyfile
import random
import endpoints.upload
import endpoints.algorithms.voxel_downsampling
import endpoints.algorithms.remove_outliers.statistical
import endpoints.algorithms.remove_outliers.radius
import endpoints.algorithms.poisson_sampling

from flask import Flask, send_file, request, url_for, redirect
from flask_cors import CORS
# from flask_socketio import SocketIO

#from flask_jwt_extended import create_access_token
#from flask_jwt_extended import JWTManager
from datetime import timedelta

from convert import createConversions

"""
Payload.max_decode_packets = 50000
SocketIO(async_mode="gevent", ping_timeout=100000, pong_timeout=100000)
"""

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sasdfdsfgd'
CORS(app, resources={ r'/*': {'origins': [
	'http://localhost:3000', '*'  # React
	# React
]}}, supports_credentials=True)

# Load config
app.config.from_pyfile("config.py")

app.config['CORS_HEADERS'] = 'Content-Type'
# socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

""" JWT tokens setup. """
"""
app.config["JWT_SECRET_KEY"] = "dev secret key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=72)
jwt = JWTManager(app)
"""

FileType = Dict[str, str]

def getAccessToken():  # TODO
	...

def getFileData(file: FileType):
	pointCloudData = re.sub('^data:application/octet-stream;base64,', '', file["content"])
	return base64.b64decode(pointCloudData)

"""
@socketio.on("fileUpload")
def handle_json(file: FileType):
  fileContent = getFileData(file)
  with open("frontend.ply", 'wb') as f:
    f.write(fileContent)

@socketio.on("convert")  # this won't work (socketio doesn't work this way)
def convert():
  # TODO: conversion
  zipf = zipfile.ZipFile("converted.zip", "w", zipfile.ZIP_DEFLATED)
  for root, dirs, files in os.walk("../testing/open3d_testing/export"):
    for file in files:
      zipf.write(f"../testing/open3d_testing/export{file}")
  zipf.close()
  return send_file("../converted.zip",
    mimetype="zip",
    download_name="converted.zip",
    as_attachment=True
  )
"""

@app.route("/download")
def download():
	zipf = zipfile.ZipFile("converted.zip", "w", zipfile.ZIP_DEFLATED)
	for root, dirs, files in os.walk("testing/open3d_testing/export/"):
		for file in files:
			zipf.write(f"testing/open3d_testing/export/{file}", arcname=file)
	zipf.close()
	return send_file("../converted.zip",
	                 mimetype="zip",
	                 download_name="converted.zip",
	                 as_attachment=True
	                 )

@app.route("/api/convert", methods=["POST"])
def convert():
	from os.path import join as joinPath
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

app.add_url_rule(
	"/api/upload",
	view_func=endpoints.upload.UploadView.as_view("upload"),
	methods=["POST"]
)

app.add_url_rule(
	"/api/algorithms/voxel-downsampling",
	view_func=endpoints.algorithms.voxel_downsampling.VoxelDownsamplingView.as_view("voxel_downsampling"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/statistical-outlier-removal",
	view_func=endpoints.algorithms.remove_outliers.statistical.StatisticalOutlierRemovalView.as_view("statistical_outlier_removal"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/radius-outlier-removal",
	view_func=endpoints.algorithms.remove_outliers.radius.RadiusOutlierRemovalView.as_view("radius_outlier_removal"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/poisson-sampling",
	view_func=endpoints.algorithms.poisson_sampling.PoissonSamplingView.as_view("poisson_sampling"),
	methods=["PUT"]
)

# useful links
# https://stackoverflow.com/questions/46805813/set-the-http-status-text-in-a-flask-response

if __name__ == '__main__':
	#socketio.run(app, debug=True, host="localhost", port=3001)
	app.run(debug=True, host="localhost", port=3001)
