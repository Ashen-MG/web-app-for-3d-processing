"""
Using PointNet as encoder and MLP as decoder to generate new point clouds closer to ground truth.
"""

import tensorflow as tf
from config import *
if TRAIN_ON_CPU:
	os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
from tensorflow import keras
from keras import layers
from utils.dataset import loadDataset
from utils.visualize import *
from losses.chamfer import chamfer_distance_tf
from models.pointnet import conv_bn, dense_bn, tnet

tf.random.set_seed(1234)

trainScanPoints, trainCADPoints, testScanPoints, testCADPoints = loadDataset()
trainDatatset = tf.data.Dataset.from_tensor_slices((trainScanPoints, trainCADPoints))
testDataset = tf.data.Dataset.from_tensor_slices((testScanPoints, testCADPoints))

trainDataset = trainDatatset.shuffle(len(trainScanPoints)).batch(BATCH_SIZE)
testDataset = testDataset.shuffle(len(testScanPoints)).batch(BATCH_SIZE)

inputs = keras.Input(shape=(NUM_POINTS, 3))

x = tnet(inputs, 3)
x = conv_bn(x, 128)
x = conv_bn(x, 128)
x = tnet(x, 128)
x = conv_bn(x, 128)
x = conv_bn(x, 256)
x = conv_bn(x, 2048)
x = layers.GlobalMaxPooling1D()(x)  # 2048 global feature
x = dense_bn(x, 1024)
x = layers.Dropout(0.3)(x)
x = dense_bn(x, 1024)
x = layers.Dropout(0.3)(x)
x = layers.Dense(NUM_POINTS * 3)(x)
outputs = layers.Reshape((NUM_POINTS, 3))(x)
model = keras.Model(inputs=inputs, outputs=outputs, name="pointnet")
model.summary()

model.load_weights("custom_pointnet_checkpoints/weights")

model.compile(
	loss=chamfer_distance_tf,
	optimizer=keras.optimizers.Adam(learning_rate=0.001)
)

modelCheckpointCallback = tf.keras.callbacks.ModelCheckpoint(
	"custom_pointnet_checkpoints/weights",
	monitor="val_loss",
	verbose=0,
	save_best_only=False,
	save_weights_only=True,
	save_freq="epoch",
	options=None,
	initial_value_threshold=None,
)

# model.fit(trainDataset, epochs=3, validation_data=testDataset, callbacks=[modelCheckpointCallback])

predictions = model.predict(trainScanPoints)
visualizePredictions(trainScanPoints[:4], trainCADPoints[:4], predictions[:4])

predictions = model.predict(testScanPoints)
visualizePredictions(testScanPoints[:1], testCADPoints[:1], predictions[:1])

visualizeOnePC(testScanPoints[0])
visualizeOnePC(testCADPoints[0])
visualizeOnePC(predictions[0])
