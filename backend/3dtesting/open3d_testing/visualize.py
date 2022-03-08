import open3d as o3d


pcFile = r"D:\bachelor\Challenge1-Track1-CC3D-PSE-Lines\Track1-CC3D-PSE-Lines\cc3d_pse_cad\test\test\batch_01\171_10312\User Library-SGI 3D Logo.ply"
mesh = o3d.io.read_triangle_mesh(pcFile)
mesh.compute_vertex_normals()
o3d.visualization.draw_geometries([mesh])