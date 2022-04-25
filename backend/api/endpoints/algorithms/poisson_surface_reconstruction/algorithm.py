import open3d as o3d

def poissonSurfaceReconstruction(currentFilePath: str, outputFilepath: str, depth: int = 10):
	print(depth)
	pcd = o3d.io.read_point_cloud(currentFilePath)
	with o3d.utility.VerbosityContextManager(o3d.utility.VerbosityLevel.Debug) as cm:
		mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd=pcd, depth=depth)
	o3d.io.write_triangle_mesh(outputFilepath, mesh)
