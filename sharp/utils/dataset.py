from glob import glob
import open3d as o3d
import numpy as np
import h5py
from scipy.spatial import KDTree
from config import *
from utils.extract_edges import extractEdges
from utils.sampling import samplePointCloudToFixPoints, poissonSampling

def getCadSharpEdgesFiles(fileType="ply"):
	trainCadEdgesFiles = glob(os.path.join(DATA_CAD_EDGES_DIR, f"train/*/*/*.{fileType}"))
	testCadEdgesFiles = glob(os.path.join(DATA_CAD_EDGES_DIR, f"test/*/*/*.{fileType}"))
	return trainCadEdgesFiles, testCadEdgesFiles

def getDatasetFiles():
	trainScanFiles = glob(os.path.join(DATA_SCANS_DIR, "train/*/*/*"))
	trainCADFiles = glob(os.path.join(DATA_CAD_DIR, "train/*/*/*"))
	testScanFiles = glob(os.path.join(DATA_SCANS_DIR, "test/*/*/*"))
	testCADFiles = glob(os.path.join(DATA_CAD_DIR, "test/*/*/*"))
	return trainScanFiles, trainCADFiles, testScanFiles, testCADFiles

def parseDataset():
	trainScanPoints, trainCADPoints, testScanPoints, testCADPoints = [], [], [], []

	trainScanFiles, trainCADFiles, testScanFiles, testCADFiles = getDatasetFiles()
	trainCadEdgesFiles, testCadEdgesFiles = getCadSharpEdgesFiles()

	for testing, dataset in enumerate([(trainScanFiles, trainCADFiles, trainCadEdgesFiles), (testScanFiles, testCADFiles, testCadEdgesFiles)]):
		scan, cad, cadEdges = dataset
		for i in range(len(scan)):
			if i in (196, 732, 2279) and not testing and EDGES_ONLY:  # BUG in the dataset: no line segments extracted in CAD edges
				continue
			if not testing and i in (413, 1807):  # BUG in the dataset: training set contains two point clouds instead of meshes
				continue
			print(f"Parsing {'testing' if testing else 'training'} part of the dataset: {i + 1}/{len(scan)}")
			if EDGES_ONLY:
				edges = extractEdges(scan[i])
				edges.save("temp-edges.ply")
				scanPcd = samplePointCloudToFixPoints("temp-edges.ply")
				cadPoints = np.asarray(o3d.io.read_point_cloud(cadEdges[i]).points)
			else:
				scanPcd = poissonSampling(scan[i])
				cadMesh = poissonSampling(cad[i])
				cadPoints = np.asarray(cadMesh.points)
			scanPoints = np.asarray(scanPcd.points)
			if ORDERED:
				cadKDTree = KDTree(cadPoints)
				_, indexes = cadKDTree.query(scanPoints)
				cadPoints = cadPoints[indexes]  # ordered nn points from CAD to scan
			if testing:
				testScanPoints.append(scanPoints)
				testCADPoints.append(cadPoints)
			else:
				trainScanPoints.append(scanPoints)
				trainCADPoints.append(cadPoints)
		print()

	if EDGES_ONLY:
		os.remove("temp-edges.ply")

	print("\nDataset parsed.")

	return np.array(trainScanPoints), np.array(trainCADPoints), np.array(testScanPoints), np.array(testCADPoints)

def createDataset():
	""" Parse and save the dataset. """
	trainScanPoints, trainCADPoints, testScanPoints, testCADPoints = parseDataset()
	with h5py.File(os.path.join(ROOT_DIR, rf"datasets/cc3d-pse-{NUM_POINTS}{'-ordered' if ORDERED else ''}{'-edges' if EDGES_ONLY else ''}.h5"), 'w') as hf:
		hf.create_dataset("trainScanPoints", data=trainScanPoints)
		hf.create_dataset("trainCADPoints",  data=trainCADPoints)
		hf.create_dataset("testScanPoints",  data=testScanPoints)
		hf.create_dataset("testCADPoints",   data=testCADPoints)

def loadDataset():
	print("Loading dataset...", end="")
	with h5py.File(os.path.join(ROOT_DIR, rf"datasets/cc3d-pse-{NUM_POINTS}{'-ordered' if ORDERED else ''}{'-edges' if EDGES_ONLY else ''}.h5"), 'r') as hf:
		trainScanPoints = hf["trainScanPoints"][:]
		trainCADPoints  = hf["trainCADPoints"][:]
		testScanPoints  = hf["testScanPoints"][:]
		testCADPoints   = hf["testCADPoints"][:]
	print("DONE")
	return trainScanPoints, trainCADPoints, testScanPoints, testCADPoints

if __name__ == "__main__":
	createDataset()
