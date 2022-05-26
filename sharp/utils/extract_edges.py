import pyvista as pv

def extractEdges(filepath):
	mesh = pv.read(filepath)
	edges = mesh.extract_feature_edges(feature_angle=15)
	return edges
