import open3d as o3d

def voxelDownsampling(currentFilePath: str, outputFilepath: str, voxelSize: float):
	if voxelSize <= 0:
		return False, "Voxel size should be > 0."
	pcd = o3d.io.read_point_cloud(currentFilePath)
	downpcd = pcd.voxel_down_sample(voxel_size=voxelSize)
	o3d.io.write_point_cloud(outputFilepath, downpcd)
	return True, ""
