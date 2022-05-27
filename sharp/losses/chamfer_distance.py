""" Source: https://stackoverflow.com/questions/54705569/is-it-possible-to-build-a-custom-loss-function-of-chamfer-distance-using-keras """

import keras.backend as K
import tensorflow as tf
from config import NUM_POINTS

def dists_mat_calculater(pnts_t, pnts_p):
	"""
	arguments:
			pnts_t : from y_true[bi], shape: (num_t, 3)
			pnts_p : from y_pred[bi], shape: (num_p, 3)

	return:
			dists_mat: shape: (num_t, num_p)
	"""
	num_t = K.int_shape(pnts_t)[0]
	num_p = K.int_shape(pnts_p)[0]

	pnts_t = tf.reshape(tf.tile(tf.expand_dims(pnts_t, 1), [1, 1, num_p]), [-1, 3])
	pnts_p = tf.tile(pnts_p, [num_t, 1])

	dists_mat = K.sum(K.square(tf.subtract(pnts_t, pnts_p)), axis=1)
	dists_mat = tf.reshape(dists_mat, [num_t, num_p])
	dists_mat_upper = tf.compat.v1.matrix_band_part(dists_mat, 0, -1)
	dists_mat_symm = dists_mat_upper + tf.transpose(dists_mat_upper)
	dists_mat_symm = tf.compat.v1.matrix_set_diag(dists_mat_symm, tf.compat.v1.diag_part(dists_mat))

	return dists_mat_symm

def dist_calculator(pnts):
	"""
	arguments:
			pnts_t : from y_true[bi], shape: (num_t, 3)
			pnts_p : from y_pred[bi], shape: (num_p, 3)

	return:
			dist: shape: (1, )
	"""
	pnts_t, pnts_p = pnts
	dists_mat = dists_mat_calculater(pnts_t, pnts_p)
	dist_t_to_p = K.mean(K.min(dists_mat, axis=0)) #shape: (1,)
	dist_p_to_t = K.mean(K.min(dists_mat, axis=1)) #shape: (1,)
	dist = K.max([dist_p_to_t, dist_t_to_p]) #shape: (1,)
	return dist

def chamfer_loss_func_tf(y_true,y_pred):
	"""
	Calculate the chamfer distance,use euclidean metric
	:param y_true:
	:param y_pred:
	:return:
	"""
	y_true = K.reshape(y_true,[-1, NUM_POINTS, 3])
	y_pred = K.reshape(y_pred, [-1, NUM_POINTS, 3])
	return K.mean(tf.map_fn(dist_calculator, elems=(y_true, y_pred), dtype=tf.float32))
