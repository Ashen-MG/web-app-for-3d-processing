import open3d as o3d

def poissonSampling(currentFilePath: str, outputFilepath: str, numberOfPoints: int) -> (bool, str):
	mesh = o3d.io.read_triangle_mesh(currentFilePath)
	if len(mesh.triangles) == 0:
		return False, "Input mesh has no triangles."
	mesh.compute_vertex_normals()
	pcd = mesh.sample_points_poisson_disk(number_of_points=numberOfPoints)
	o3d.io.write_point_cloud(outputFilepath, pcd)
	return True, ""
