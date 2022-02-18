import open3d as o3d


pointCloudFile = r"D:\bachelor_work\GPUPly\scan_016.ply"
outputFileName = r"export\downscaled_pointcloud.ply"
downSampleVoxelSize = 1.59

pcd = o3d.io.read_point_cloud(pointCloudFile)

# http://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html
print(f"Downsample the point cloud with a voxel of {downSampleVoxelSize}")
downpcd = pcd.voxel_down_sample(voxel_size=downSampleVoxelSize)

print(f"Number of points in loaded point cloud: {len(pcd.points)}")
print(f"Number of points in downscaled point cloud: {len(downpcd.points)}")

o3d.visualization.draw_geometries([downpcd])

# http://www.open3d.org/docs/latest/tutorial/Basic/file_io.html
o3d.io.write_point_cloud(outputFileName, downpcd)
