import open3d as o3d

def radiusOutlierRemoval(currentFilePath: str, outputFilepath: str, numberOfPoints: int, radius: float):
	pcd = o3d.io.read_point_cloud(currentFilePath)
	_, index = pcd.remove_radius_outlier(nb_points=numberOfPoints, radius=radius)
	inlierpcd = pcd.select_by_index(index)
	o3d.io.write_point_cloud(outputFilepath, inlierpcd)
