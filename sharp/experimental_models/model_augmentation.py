import os
from config import *
import tensorflow as tf
if TRAIN_ON_CPU:
	os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
import numpy as np
from tensorflow import keras
from keras.layers import Dense, BatchNormalization, Dropout, Activation, Reshape, Add
from utils.dataset import loadDataset
from utils.visualize import *
from utils.point_cloud_operations import rotatePointCloud
from losses.chamfer import chamfer_distance_tf, chamfer_distance_sklearn
from losses.euclidean import euclidean_distance_loss

tf.random.set_seed(1234)

NUM_MLPS = 1
MIN_MAX_NORMALIZATION = True
ZERO_CENTERING = False

trainScanPoints, trainCADPoints, testScanPoints, testCADPoints = loadDataset()

d = [trainScanPoints, trainCADPoints, testScanPoints, testCADPoints]
minMax, means = [], []

for i in range(len(d)):
	if MIN_MAX_NORMALIZATION:
		_min, _max = np.min(d[i]), np.max(d[i])
		minMax.append((_min, _max))
		d[i] = (d[i] - _min) / (_max - _min)
	# mean-subtraction or zero-centering => subtracting mean from each of the data point to make it zero-centered.
	if ZERO_CENTERING:
		means.append(np.mean(d[i], axis=0))
		d[i] -= means[i]
		dist_max = np.max(np.linalg.norm(d[i] - np.array([0, 0, 0])))

testDataset = tf.data.Dataset.from_tensor_slices((d[2], d[3]))
testDataset = testDataset.shuffle(len(testScanPoints)).batch(BATCH_SIZE)

# initializer = tf.keras.initializers.RandomUniform(minval=0, maxval=0.000001, seed=None)
# initializer = tf.keras.initializers.RandomNormal(mean=0., stddev=1.)
initializer = tf.keras.initializers.HeUniform()

def MLPoffsets(prev, dropout=.25):
	x = Reshape((NUM_POINTS * 3,))(prev)
	x = Dense(2048, kernel_initializer=initializer)(x)
	x = BatchNormalization()(x)
	x = Activation("relu")(x)
	x = Dropout(dropout)(x)
	x = Dense(2048, kernel_initializer=initializer)(x)
	x = BatchNormalization()(x)
	x = Activation("relu")(x)
	x = Dropout(dropout)(x)
	x = Dense(NUM_POINTS * 3)(x)
	x = Reshape((NUM_POINTS, 3))(x)
	added = Add()([x, prev])
	return added

inputLayer = tf.keras.Input(shape=(NUM_POINTS, 3))
added = MLPoffsets(inputLayer)

for _ in range(NUM_MLPS - 1):
	added = MLPoffsets(added)

newModel = tf.keras.models.Model(inputLayer, added)
newModel.summary()

# newModel.load_weights("checkpoints/weights")

newModel.compile(
	loss=euclidean_distance_loss,
	optimizer=keras.optimizers.Adam(learning_rate=0.001)
)

modelCheckpointCallback = tf.keras.callbacks.ModelCheckpoint(
	"checkpoints/weights",
	monitor="val_loss",
	verbose=0,
	save_best_only=False,
	save_weights_only=True,
	save_freq="epoch",
	options=None,
	initial_value_threshold=None,
)

histories = []

# trainScanPointsRotated, trainCADPointsRotated = rotatePointCloud(d[0], d[1])
# visualizePredictions(trainScanPointsRotated[:4], trainCADPointsRotated[:4], trainCADPointsRotated[:4])

for _ in range(5):
		trainScanPointsRotated, trainCADPointsRotated = rotatePointCloud(d[0], d[1]) if ZERO_CENTERING else (d[0], d[1])
		history = newModel.fit(
			trainScanPointsRotated, trainCADPointsRotated,
			validation_data=testDataset, epochs=1, shuffle=True, batch_size=BATCH_SIZE, callbacks=[modelCheckpointCallback]
		)
		histories.append(history)

predictions = newModel.predict(d[0])
visualizePredictions(d[0][:4], d[1][:4], predictions[:4])

predictions = newModel.predict(d[2])
visualizePredictions(d[2][:4], d[3][:4], predictions[:4])
