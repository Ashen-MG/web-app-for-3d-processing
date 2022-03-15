import open3d as o3d

def statisticalOutlierRemoval(currentFilePath: str, outputFilepath: str, numberOfNeighbors: int, stdRatio: float):
	pcd = o3d.io.read_point_cloud(currentFilePath)
	_, index = pcd.remove_statistical_outlier(nb_neighbors=numberOfNeighbors, std_ratio=stdRatio)
	inlierpcd = pcd.select_by_index(index)
	o3d.io.write_point_cloud(outputFilepath, inlierpcd)
