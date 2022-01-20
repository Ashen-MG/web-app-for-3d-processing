import open3d as o3d


supportedExtensions = ["ply", "xyz", "xyzrgb", "pts", "pcd"]

pointCloudFile = r"export\converted.pcd"

pcd = o3d.io.read_point_cloud(pointCloudFile)

for extension in supportedExtensions:
	outputFileName = r"export\converted." + extension
	o3d.io.write_point_cloud(outputFileName, pcd)
