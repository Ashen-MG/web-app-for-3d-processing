"""
Predict vector offsets to each point in a point cloud that comes on the input to the network.
Predicted offsets are then added to each point, resulting in a new point cloud with shifted points.
In case `ORDERED = False` in `config.py` we recommend using losses.chamfer.chamfer_distance_tf as a loss function.
In case `ORDERED = True` in `config.py` we recommend using losses.euclidean.euclidean_distance_loss as a loss function
since points in the dataset are pre-aligned
(i.e. each point will converge to the previously found nearest neighbor from ground truth).
"""

import os
from config import *
if TRAIN_ON_CPU:
	os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
import tensorflow as tf
from tensorflow import keras
from keras.layers import Dense, BatchNormalization, Dropout, Activation, Reshape, Add
from utils.dataset import loadDataset
from utils.visualize import *
from losses.chamfer import chamfer_distance_tf, chamfer_distance_sklearn
from losses.euclidean import euclidean_distance_loss

tf.random.set_seed(1234)

trainScanPoints, trainCADPoints, testScanPoints, testCADPoints = loadDataset()

trainDataset = tf.data.Dataset.from_tensor_slices((trainScanPoints, trainCADPoints))
testDataset = tf.data.Dataset.from_tensor_slices((testScanPoints, testCADPoints))

trainDataset = trainDataset.shuffle(len(trainScanPoints)).batch(BATCH_SIZE)
testDataset = testDataset.shuffle(len(testScanPoints)).batch(BATCH_SIZE)

# --------------

inputLayer = tf.keras.Input(shape=(NUM_POINTS, 3))

# initializer = tf.keras.initializers.Zeros()
# initializer = tf.keras.initializers.RandomNormal(mean=0., stddev=1.)

mlpModel = tf.keras.models.Sequential()
mlpModel.add(inputLayer)
mlpModel.add(Reshape((NUM_POINTS * 3,)))
mlpModel.add(Dense(128))
mlpModel.add(BatchNormalization())
mlpModel.add(Activation(keras.layers.LeakyReLU()))
mlpModel.add(Dropout(0.25))
mlpModel.add(Dense(256))
mlpModel.add(BatchNormalization())
mlpModel.add(Activation(keras.layers.LeakyReLU()))
mlpModel.add(Dropout(0.25))
mlpModel.add(Dense(512))
mlpModel.add(BatchNormalization())
mlpModel.add(Activation(keras.layers.LeakyReLU()))
mlpModel.add(Dropout(0.25))
mlpModel.add(Dense(NUM_POINTS * 3))
mlpModel.add(Reshape((NUM_POINTS, 3)))

modelMergedOut = Add()([mlpModel.output, inputLayer])

newModel = tf.keras.models.Model(inputLayer, modelMergedOut)
newModel.summary()

# newModel.load_weights("checkpoints/weights")

newModel.compile(
	loss=euclidean_distance_loss,
	optimizer=keras.optimizers.Adam(learning_rate=0.001)
)

# regular saving of weights (https://keras.io/api/callbacks/model_checkpoint)
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

history = newModel.fit(trainDataset, epochs=10, validation_data=testDataset, callbacks=[modelCheckpointCallback])
visualizeHistory(history, title=None)

# newModel.save("saved-model")
# newModel = keras.models.load_model("model", compile=False)

predictions = newModel.predict(trainScanPoints)
visualizePredictions(trainScanPoints[:4], trainCADPoints[:4], predictions[:4])

"""
cdTrainLoss = 0
for i in range(len(predictions)):
		cdTrainLoss += chamfer_distance_sklearn(trainCADPoints[i:i+1], predictions[i:i+1])
		print(f"CD train: {cdTrainLoss / len(predictions)}", end='\r')
print()
"""

predictions = newModel.predict(testScanPoints)
visualizePredictions(testScanPoints[:4], testCADPoints[:4], predictions[:4])

"""
cdTestLoss = 0
for i in range(len(predictions)):
		cdTestLoss += chamfer_distance_sklearn(testCADPoints[i:i+1], predictions[i:i+1])
		print(f"CD test: {cdTestLoss / len(predictions)}", end='\r')
print()
"""
