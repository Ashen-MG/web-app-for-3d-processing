import open3d as o3d

def voxelDownsampling(filename: str, outputFilename: str, voxelSize: float):
	"""
	:param outputFilename:
	:param filename:
	:param voxelSize: Downsampling voxel size.
	:return:
	"""
	pcd = o3d.io.read_point_cloud(filename)
	downpcd = pcd.voxel_down_sample(voxel_size=voxelSize)
	o3d.io.write_point_cloud(outputFilename, downpcd)
