import os

# project root
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# dataset preparation
DATA_DIR = r"C:\Users\Marti\projects\datasets\Track1-CC3D-PSE-Lines"
DATA_SCANS_DIRNAME = "cc3d_pse_scan"
DATA_CAD_DIRNAME = "cc3d_pse_cad"
DATA_CAD_EDGES_DIRNAME = "cc3d_pse_edges"
DATA_SCANS_DIR = os.path.join(DATA_DIR, DATA_SCANS_DIRNAME)
DATA_CAD_DIR = os.path.join(DATA_DIR, DATA_CAD_DIRNAME)
DATA_CAD_EDGES_DIR = os.path.join(DATA_DIR, DATA_CAD_EDGES_DIRNAME)

# what strategy/dataset type to use
""" 
ORDERED = True:
	If P1 is a point cloud sampled from
	corrupted mesh and P2 is a point cloud sampled from the corresponding CAD model.
	Then, from a data structure point of view, P1 and P2 are pre-aligned such that on i-th
	index in P1 there is the nearest neighbor on i-th index in P2. 
"""
ORDERED = False

"""
EDGES_ONLY = True:
	Running `utils/dataset.py` will create h5py dataset of NUM_POINTS x 3 point cloud extracted edges from corrupted mesh scans 
	and ground truth sharp edges.
	Models are going to be trained on edges only. 
EDGES_ONLY = False:
	Running `utils/dataset.py` will create h5py dataset of NUM_POINTS x 3 point cloud from corrupted mesh scans 
	and ground truth CAD models.
	Models are going to be trained on whole 3D scans.
"""
EDGES_ONLY = False

# used for dataset parsing and training & evaluating
NUM_POINTS = 2048
BATCH_SIZE = 2048

TRAIN_ON_CPU = False
