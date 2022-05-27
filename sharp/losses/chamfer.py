""" Source: https://stackoverflow.com/questions/47060685/chamfer-distance-between-two-point-clouds-in-tensorflow/54767428 """

import tensorflow as tf
from scipy.spatial import KDTree
import numpy as np

def distance_matrix(array1, array2):
	"""
	arguments:
		array1: the array, size: (num_point, num_feature)
		array2: the samples, size: (num_point, num_feature)
	returns:
		distances: each entry is the distance from a sample to array1, it's size: (num_point, num_point)
	"""
	num_point, num_features = array1.shape
	expanded_array1 = tf.tile(array1, (num_point, 1))
	expanded_array2 = tf.reshape(
		tf.tile(tf.expand_dims(array2, 1),
						(1, num_point, 1)),
		(-1, num_features))
	distances = tf.norm(expanded_array1 - expanded_array2, axis=1)
	distances = tf.reshape(distances, (num_point, num_point))
	return distances

def av_dist(array1, array2):
	"""
	arguments: array1, array2: both size: (num_points, num_feature)
	returns: distances: size: (1,)
	"""
	distances = distance_matrix(array1, array2)
	distances = tf.reduce_min(distances, axis=1)
	distances = tf.reduce_mean(distances)
	return distances

def av_dist_sum(arrays):
	"""
	arguments: arrays: array1, array2
	returns: sum of av_dist(array1, array2) and av_dist(array2, array1)
	"""
	array1, array2 = arrays
	av_dist1 = av_dist(array1, array2)
	av_dist2 = av_dist(array2, array1)
	return av_dist1 + av_dist2

def chamfer_distance_tf(array1, array2):
	batch_size, num_point, num_features = array1.shape
	dist = tf.reduce_mean(tf.map_fn(av_dist_sum, elems=(array1, array2), dtype=tf.float32))
	return dist

def chamfer_distance_tf_random(array1, array2):
	batch_size, num_point, num_features = array1.shape
	r = tf.random.shuffle(tf.range(16000))[:4000]
	arr1, arr2 = tf.gather(array1, r, axis=1), tf.gather(array2, r, axis=1)
	dist = tf.reduce_mean(tf.map_fn(av_dist_sum, elems=(arr1, arr2), dtype=tf.float32))
	return dist

def chamfer_distance_sklearn(array1, array2):
	batch_size, num_point = array1.shape[:2]
	dist = 0
	for i in range(batch_size):
		tree1 = KDTree(array1[i], leafsize=num_point + 1)
		tree2 = KDTree(array2[i], leafsize=num_point + 1)
		distances1, _ = tree1.query(array2[i])
		distances2, _ = tree2.query(array1[i])
		av_dist1 = np.mean(distances1)
		av_dist2 = np.mean(distances2)
		dist = dist + (av_dist1 + av_dist2) / batch_size
	return dist
