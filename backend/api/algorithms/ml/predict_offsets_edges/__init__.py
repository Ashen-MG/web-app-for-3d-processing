import open3d as o3d
from tensorflow import keras
import numpy as np

def predict(currentFilePath: str, outputFilepath: str):
	pcd = o3d.io.read_point_cloud(currentFilePath)
	if len(pcd.points) != 2048:
		return False, "Invalid number of points in the input (expected 2048 x 3)."
	newModel = keras.models.load_model("algorithms/ml/predict_offsets_edges/model_2048_ordered_edges_500_0001", compile=False)
	predictions = newModel.predict(np.reshape(np.asarray(pcd.points), (-1, 2048, 3)))
	pcd.points = o3d.utility.Vector3dVector(predictions[0])
	o3d.io.write_point_cloud(outputFilepath, pcd)
	return True, ""
