import base64
import os
import re
import zipfile
from typing import Dict
from shutil import copyfile
import random
import endpoints.upload
import endpoints.export
import endpoints.convert
import endpoints.algorithms.voxel_downsampling
import endpoints.algorithms.remove_outliers.statistical
import endpoints.algorithms.remove_outliers.radius
import endpoints.algorithms.poisson_sampling

from flask import Flask, send_file, request, url_for, redirect
from flask_cors import CORS

#from flask_jwt_extended import create_access_token
#from flask_jwt_extended import JWTManager
from datetime import timedelta

from convert import createConversions

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

app.add_url_rule(
	"/api/upload",
	view_func=endpoints.upload.UploadView.as_view("upload"),
	methods=["POST"]
)

app.add_url_rule(
	"/api/export",
	view_func=endpoints.export.ExportView.as_view("export"),
	methods=["POST"]
)

app.add_url_rule(
	"/api/convert",
	view_func=endpoints.convert.ConvertView.as_view("convert"),
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
	app.run(debug=True, host="localhost", port=3001)
