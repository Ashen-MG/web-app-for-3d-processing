import numpy as np

def rotatePointCloud(batchData, batchData2):
	"""
	Source: https://github.com/garyli1019/pointnet-keras/blob/master/train_seg.py
	Modified to apply same rotation input and gt (i.e. `batchData` and `batchData2`)
	"""
	rotated_data = np.zeros(batchData.shape, dtype=np.float32)
	rotated_data2 = np.zeros(batchData.shape, dtype=np.float32)
	for k in range(batchData.shape[0]):
		rotation_angle = np.random.uniform() * 2 * np.pi
		cosval = np.cos(rotation_angle)
		sinval = np.sin(rotation_angle)
		rotation_matrix = np.array([[cosval, 0, sinval],
																[0, 1, 0],
																[-sinval, 0, cosval]])
		shape_pc = batchData[k, ...]
		shape_pc2 = batchData2[k, ...]
		rotated_data[k, ...] = np.dot(shape_pc.reshape((-1, 3)), rotation_matrix)
		rotated_data2[k, ...] = np.dot(shape_pc2.reshape((-1, 3)), rotation_matrix)
	return rotated_data, rotated_data2
