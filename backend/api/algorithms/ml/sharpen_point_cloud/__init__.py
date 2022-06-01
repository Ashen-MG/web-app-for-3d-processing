import open3d as o3d
from tensorflow import keras
import numpy as np
from flask import current_app as app
from os.path import join as joinPath

def predict(currentFilePath: str, outputFilepath: str):
	pcd = o3d.io.read_point_cloud(currentFilePath)
	if len(pcd.points) != 2048:
		return False, "Invalid number of points in the input (expected 2048 x 3)."
	newModel = keras.models.load_model(
		joinPath(app.root_path, "algorithms/ml/sharpen_point_cloud/model_2048_ordered_1000_0001"),
		compile=False
	)
	predictions = newModel.predict(np.reshape(np.asarray(pcd.points), (-1, 2048, 3)))
	pcd.points = o3d.utility.Vector3dVector(predictions[0])
	o3d.io.write_point_cloud(outputFilepath, pcd)
	return True, ""
