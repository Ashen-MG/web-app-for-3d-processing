import open3d as o3d
import numpy as np
from utils.dataset import getDatasetFiles, getCadSharpEdgesFiles
from scipy.spatial import KDTree
import time

trainScanFiles, trainCADFiles, testScanFiles, testCADFiles = getDatasetFiles()
trainCadEdgesFiles, testCadEdgesFiles = getCadSharpEdgesFiles()

def linear(scanVertices: np.ndarray, sharpEdgePoints: np.ndarray):
	nnIndexes = []
	for s, p in enumerate(sharpEdgePoints):
		print(s)
		i, m = -1, float("inf")
		for j, v in enumerate(scanVertices):
			d = np.linalg.norm(p - v)
			if d < m:
				i, m = j, d
		nnIndexes.append(i)
	nnIndexes = np.asarray(nnIndexes)
	scanVertices[nnIndexes] = sharpEdgePoints

def kd(scanVertices: np.ndarray, sharpEdgePoints: np.ndarray, k: int, balanced: bool):
	kdtree = KDTree(scanVertices, balanced_tree=balanced)
	distances, indexes = kdtree.query(sharpEdgePoints, k=k)
	for i in range(len(indexes)):
		scanVertices[indexes[i]] = sharpEdgePoints[i]

if __name__ == "__main__":  # testing
	i = 1400
	sharpEdges = o3d.io.read_point_cloud(trainCadEdgesFiles[i])
	o3d.visualization.draw_geometries([sharpEdges])
	sharpPoints = np.asarray(sharpEdges.points)
	print(len(sharpPoints))
	mesh = o3d.io.read_triangle_mesh(trainScanFiles[i])
	mesh.compute_vertex_normals()
	o3d.visualization.draw_geometries([mesh])
	mesh.compute_vertex_normals()
	# o3d.visualization.draw_geometries([mesh])
	vertices = np.asarray(mesh.vertices)
	print(len(vertices))
	start = time.time()
	# linear(vertices, sharpPoints)
	kd(vertices, sharpPoints, k=20, balanced=True)
	print(f"{(time.time() - start):.4f}")
	mesh.vertices = o3d.utility.Vector3dVector(vertices)
	mesh.compute_vertex_normals()
	o3d.visualization.draw_geometries([mesh])
