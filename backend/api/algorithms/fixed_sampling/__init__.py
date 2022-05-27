from scipy.spatial import KDTree
import numpy as np
import open3d as o3d

def samplePointCloudToFixPoints(currentFilePath: str, outputFilepath: str, numberOfPoints: int):
	pcd = o3d.io.read_point_cloud(currentFilePath)

	# use voxel downsampling while number of points in the input point cloud is bigger that numberOfPoints
	k = -2
	voxelSize = 10 ** k
	while len(pcd.points) > numberOfPoints:
		previousPcd = pcd
		pcd = pcd.voxel_down_sample(voxelSize)
		if len(pcd.points) == numberOfPoints:
			return pcd
		if len(pcd.points) > numberOfPoints:
			voxelSize *= 2
		else:
			pcd = previousPcd
			k -= 1
			if k <= -4:
				break
			voxelSize = 10 ** k

	voxelSize = 0.001
	while len(pcd.points) > numberOfPoints:
		pcd = pcd.voxel_down_sample(voxelSize)
		voxelSize += 0.001

	# upsample if len(pcd.points) < numberOfPoints by adding points in the middle of two nn
	while len(pcd.points) != numberOfPoints:
		points = np.asarray(pcd.points)
		missingPointsCount = numberOfPoints - len(points)
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

	o3d.io.write_point_cloud(outputFilepath, pcd)
	return True, ""
