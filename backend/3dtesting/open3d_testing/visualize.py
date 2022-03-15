import open3d as o3d

# visualize point cloud
folders = {"scan": "cc3d_pse_scan", "cad": "cc3d_pse_cad", "edges": "cc3d_pse_edges"}
pcFile = fr"D:\bachelor\Challenge1-Track1-CC3D-PSE-Lines\Track1-CC3D-PSE-Lines\{folders['scan']}\test\batch_01\171_10312\User Library-SGI 3D Logo.ply"

# http://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html
# visualize mesh
mesh = o3d.io.read_triangle_mesh(pcFile)
mesh.compute_vertex_normals()
pcd = mesh.sample_points_poisson_disk(5000)
o3d.visualization.draw_geometries([mesh])

exit(0)

pcd = o3d.io.read_point_cloud(pcFile)
pcd.estimate_normals()
o3d.visualization.draw_geometries([pcd])
