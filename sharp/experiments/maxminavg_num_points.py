""" Get max, min and average number of points within the CC3D dataset. """

import open3d as o3d
from utils.dataset import getDatasetFiles

trainScanFiles, trainCADFiles, testScanFiles, testCADFiles = getDatasetFiles()

numFiles = len(trainScanFiles) + len(trainCADFiles) + len(testScanFiles) + len(testCADFiles)
numPoints = 0
# (num of points, dir index, file index)
minPoints = (float("inf"), -1, -1)
maxPoints = (0, -1, -1)

dirs = (trainScanFiles, trainCADFiles, testScanFiles, testCADFiles)

for j in range(len(dirs)):
	files = dirs[j]
	for i in range(len(files)):
		mesh = o3d.io.read_triangle_mesh(files[i])
		_numPoints = (len(mesh.vertices), j, i)
		numPoints += _numPoints[0]
		minPoints = min(_numPoints, minPoints, key=lambda x: x[0])
		maxPoints = max(_numPoints, maxPoints, key=lambda x: x[0])
		print(f"Parsing: {i+1}/{len(files)}, min: {minPoints}, max: {maxPoints}", end='\r')
	print()

print(numPoints)                        # output: 444543247
print(f"avg: {numPoints / numFiles}")   # output: 75990
print(f"min: {minPoints}")              # output: (5, 1, 1400)
print(f"max: {maxPoints}")              # output: (918557, 3, 292)
