import pyvista as pv

def edgeExtraction(currentFilePath: str, outputFilepath: str, featureAngle: int = 15):
	mesh = pv.read(currentFilePath)
	edges = mesh.extract_feature_edges(feature_angle=featureAngle)
	edges.save(outputFilepath)
	return True, ""
