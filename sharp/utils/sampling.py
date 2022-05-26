from scipy.spatial import KDTree
import numpy as np
import open3d as o3d
from config import NUM_POINTS

def poissonSampling(filepath):
	mesh = o3d.io.read_triangle_mesh(filepath)
	return mesh.sample_points_poisson_disk(number_of_points=NUM_POINTS)

def samplePointCloudToFixPoints(filepath):
	pcd = o3d.io.read_point_cloud(filepath)

	# use voxel downsampling while number of points in the input point cloud is bigger that NUM_POINTS
	k = -2
	voxelSize = 10 ** k
	while len(pcd.points) > NUM_POINTS:
		previousPcd = pcd
		pcd = pcd.voxel_down_sample(voxelSize)
		if len(pcd.points) == NUM_POINTS:
			return pcd
		if len(pcd.points) > NUM_POINTS:
			voxelSize *= 2
		else:
			pcd = previousPcd
			k -= 1
			if k <= -4:
				break
			voxelSize = 10 ** k

	voxelSize = 0.001
	while len(pcd.points) > NUM_POINTS:
		pcd = pcd.voxel_down_sample(voxelSize)
		voxelSize += 0.001

	# upsample if len(pcd.points) < NUM_POINTS by adding points in the middle of two nn
	while len(pcd.points) != NUM_POINTS:
		points = np.asarray(pcd.points)
		missingPointsCount = NUM_POINTS - len(points)
		indices = np.arange(len(points))
		np.random.shuffle(indices)
		indices = indices[:missingPointsCount]
		kdTree = KDTree(points)
		_, nnIndices = kdTree.query(points[indices], k=2)
		middlePoints = []
		for twoPointsIndices in nnIndices:
			cords = points[twoPointsIndices]
			middlePoints.append((cords[0] + cords[1]) / 2)
		points = np.concatenate((points, np.array(middlePoints)))
		pcd.points = o3d.utility.Vector3dVector(points)

	return pcd

if __name__ == "__main__":  # testing
	from dataset import getDatasetFiles
	from utils.extract_edges import extractEdges
	import os
	trainScanFiles, trainCADFiles, testScanFiles, testCADFiles = getDatasetFiles()
	edges = extractEdges(trainScanFiles[8])
	print(len(edges.points))
	edges.save("edges.ply")
	pcd = samplePointCloudToFixPoints("edges.ply")
	print(len(pcd.points))
	os.remove("edges.ply")
