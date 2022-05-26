import keras.backend as K

def euclidean_distance_loss(y_true, y_pred):
	"""
	Euclidean distance loss
	https://en.wikipedia.org/wiki/Euclidean_distance
	:param y_true: TensorFlow/Theano tensor
	:param y_pred: TensorFlow/Theano tensor of the same shape as y_true
	:return: float
	"""
	return K.sqrt(K.sum(K.square(y_pred - y_true), axis=-1))
