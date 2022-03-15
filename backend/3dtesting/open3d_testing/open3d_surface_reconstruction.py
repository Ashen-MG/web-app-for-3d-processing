import open3d as o3d
import numpy as np

pcFile = r"D:\bachelor_work\GPUPly\scan_016.ply"

originalPCD = o3d.io.read_point_cloud(pcFile)
pcd = originalPCD.voxel_down_sample(voxel_size=0.05)

print('run Poisson surface reconstruction')
with o3d.utility.VerbosityContextManager(
        o3d.utility.VerbosityLevel.Debug) as cm:
    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd, depth=9)
print(mesh)
o3d.visualization.draw_geometries([mesh],
  zoom=0.664,
  front=[-0.4761, -0.4698, -0.7434],
  lookat=[1.8900, 3.2596, 0.9284],
  up=[0.2304, -0.8825, 0.4101]
)