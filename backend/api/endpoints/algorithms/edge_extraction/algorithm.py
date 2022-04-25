import pyvista as pv
import open3d as o3d
from scipy.spatial import KDTree
import numpy as np

def edgeExtraction(currentFilePath: str, outputFilepath: str, featureAngle: int = 15):
	mesh = pv.read(currentFilePath)
	edges = mesh.extract_feature_edges(feature_angle=featureAngle)
	edges.save(outputFilepath)

