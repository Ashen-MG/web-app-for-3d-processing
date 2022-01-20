import open3d as o3d
import numpy as np

pcFile = r"export\downscaled_pointcloud.ply"

pcd = o3d.io.read_point_cloud(pcFile)

# http://www.open3d.org/docs/release/tutorial/geometry/pointcloud_outlier_removal.html
def display_inlier_outlier(cloud, ind):
    inlier_cloud = cloud.select_by_index(ind)
    outlier_cloud = cloud.select_by_index(ind, invert=True)

    print("Showing outliers (red) and inliers (gray): ")
    outlier_cloud.paint_uniform_color([1, 0, 0])
    inlier_cloud.paint_uniform_color([0.8, 0.8, 0.8])
    o3d.visualization.draw_geometries([inlier_cloud], width=1280, height=780, top=-100, left=2000)

print("Statistical oulier removal")
cl, ind = pcd.remove_statistical_outlier(nb_neighbors=200, std_ratio=.7)
# cl, ind = pcd.remove_radius_outlier(nb_points=16, radius=6)
display_inlier_outlier(pcd, ind)
