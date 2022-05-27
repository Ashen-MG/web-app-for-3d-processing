import endpoints.upload
import endpoints.export
import endpoints.convert
import endpoints.algorithms
from algorithms.voxel_downsampling import voxelDownsampling
from algorithms.remove_outliers.statistical import statisticalOutlierRemoval
from algorithms.remove_outliers.radius import radiusOutlierRemoval
from algorithms.edge_extraction import edgeExtraction
from algorithms.poisson_sampling import poissonSampling
from algorithms.poisson_surface_reconstruction import poissonSurfaceReconstruction
from algorithms.ml.sharpen_point_cloud import predict as sharpenPointCloud
from algorithms.ml.sharpen_point_cloud_edges import predict as sharpenPointCloudEdges
from flask import Flask
from flask import json
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from flasgger import Swagger
from werkzeug.exceptions import HTTPException
from os import urandom
import sys

app = Flask(__name__)
app.config["SECRET_KEY"] = urandom(32)

limiter = Limiter(app, key_func=get_remote_address, default_limits=["120/minute"])

CORS(app, resources={r"/*": {"origins": ["*"]}}, supports_credentials=True)

# Swagger (OpenAPI) docs
swagger = Swagger(
	app,
	config={
		"headers": [],
		"specs": [
			{
				"endpoint": 'apispec',
				"route": '/apispec.json',
				"rule_filter": lambda rule: True,
				"model_filter": lambda tag: True,
			}
		],
		"static_url_path": "/flasgger_static",
		"swagger_ui": True,
		"specs_route": "/apidocs/"
	},
	template={
		"info": {
			"title": "Web Application for 3D data Conversion, Processing and Visualization",
			"version": "1.0"
		},
		"host": "localhost:3001",
		"basePath": "/api",
		"consumes": [
			"application/json",
		],
		"produces": [
			"application/json",
		],
	},
)

app.config.from_pyfile("config.py")


@app.errorhandler(HTTPException)
def handle_exception(e):
	"""
	Return JSON instead of HTML for HTTP errors.
	https://flask.palletsprojects.com/en/2.1.x/errorhandling/
	"""
	# start with the correct headers and status code from the error
	response = e.get_response()
	# replace the body with JSON
	response.data = json.dumps({
		"code": e.code,
		"name": e.name,
		"message": e.description,
	})
	response.content_type = "application/json"
	return response


@app.errorhandler(500)
def handleInternalServerException(e):
	return {"message": "Internal server error."}, 500


@app.errorhandler(429)
def limiterTooManyRequestsHandler(e):
	return {"message": "Too many requests."}, 429


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
	view_func=endpoints.algorithms.AlgorithmView.as_view("voxel_downsampling", voxelDownsampling, "voxelSize"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/statistical-outlier-removal",
	view_func=endpoints.algorithms.AlgorithmView.as_view("statistical_outlier_removal", statisticalOutlierRemoval, "numberOfNeighbors", "stdRatio"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/radius-outlier-removal",
	view_func=endpoints.algorithms.AlgorithmView.as_view("radius_outlier_removal", radiusOutlierRemoval, "numberOfPoints", "radius"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/poisson-sampling",
	view_func=endpoints.algorithms.AlgorithmView.as_view("poisson_sampling", poissonSampling, "numberOfPoints"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/poisson-surface-reconstruction",
	view_func=endpoints.algorithms.AlgorithmView.as_view("poisson_surface_reconstruction", poissonSurfaceReconstruction, "depth"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/edge-extraction",
	view_func=endpoints.algorithms.AlgorithmView.as_view("edge_extraction", edgeExtraction, "featureAngle"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/ml/sharpen-point-cloud",
	view_func=endpoints.algorithms.AlgorithmView.as_view("ml_sharpen_point_cloud", sharpenPointCloud),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/ml/sharpen-point-cloud-edges",
	view_func=endpoints.algorithms.AlgorithmView.as_view("ml_sharpen_point_cloud_edges", sharpenPointCloudEdges),
	methods=["PUT"]
)

if __name__ == '__main__':
	mode = None
	if len(sys.argv) > 1:
		mode = sys.argv[1]
	if mode is None or mode not in ["dev", "prod"]:
		print("Invalid mode.")
		quit(1)

	app.run(debug=True if mode == "dev" else False, host="localhost", port=3001)
