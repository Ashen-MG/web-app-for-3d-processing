import open3d as o3d


pointCloudFile = r"D:\bachelor_work\GPUPly\scan_025.ply"
#pointCloudFile = r"..\..\frontend.ply"
pcd = o3d.io.read_point_cloud(pointCloudFile)
o3d.visualization.draw_geometries([pcd])