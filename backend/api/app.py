import endpoints.upload
import endpoints.export
import endpoints.convert
import endpoints.algorithms.voxel_downsampling
import endpoints.algorithms.remove_outliers.statistical
import endpoints.algorithms.remove_outliers.radius
import endpoints.algorithms.poisson_sampling
import endpoints.algorithms.poisson_surface_reconstruction
import endpoints.algorithms.edge_extraction

from flask import Flask
from flask import json
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from os import urandom
import sys

app = Flask(__name__)
app.config["SECRET_KEY"] = urandom(32)

CORS(app, resources={r"/*": {"origins": ["*"]}}, supports_credentials=True)

app.config.from_pyfile("config.py")

@app.errorhandler(HTTPException)
def handle_exception(e):
	""" Return JSON instead of HTML for HTTP errors. """
	# start with the correct headers and status code from the error
	response = e.get_response()
	# replace the body with JSON
	response.data = json.dumps({
			"code": e.code,
			"name": e.name,
			"description": e.description,
	})
	response.content_type = "application/json"
	return response

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

app.add_url_rule(
	"/api/algorithms/poisson-surface-reconstruction",
	view_func=endpoints.algorithms.poisson_surface_reconstruction.PoissonSurfaceReconstructionView.as_view("poisson_surface_reconstruction"),
	methods=["PUT"]
)

app.add_url_rule(
	"/api/algorithms/edge-extraction",
	view_func=endpoints.algorithms.edge_extraction.EdgeExtractionView.as_view("edge_extraction"),
	methods=["PUT"]
)

if __name__ == '__main__':
	mode = None
	if len(sys.argv) > 1:
		mode = sys.argv[1]
		print(mode)
	if mode is None or mode not in ["dev", "prod"]:
		print("Invalid mode.")
		quit(1)

	app.run(debug=True if mode == "dev" else False, host="localhost", port=3001)
