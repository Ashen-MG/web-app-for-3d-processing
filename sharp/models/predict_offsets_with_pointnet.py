import os
from config import *
import tensorflow as tf
if TRAIN_ON_CPU:
	os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
from tensorflow import keras
from keras import layers
from utils.dataset import loadDataset
from utils.visualize import visualizePredictions
from keras.layers import Add
from losses.chamfer import chamfer_distance_tf
from models.pointnet import conv_bn, dense_bn, tnet

tf.random.set_seed(1234)

trainScanPoints, trainCADPoints, testScanPoints, testCADPoints = loadDataset()

trainDataset = tf.data.Dataset.from_tensor_slices((trainScanPoints, trainCADPoints))
testDataset = tf.data.Dataset.from_tensor_slices((testScanPoints, testCADPoints))

trainDataset = trainDataset.shuffle(len(trainScanPoints)).batch(BATCH_SIZE)
testDataset = testDataset.shuffle(len(testScanPoints)).batch(BATCH_SIZE)

inputs = keras.Input(shape=(NUM_POINTS, 3))

x = tnet(inputs, 3)
x = conv_bn(x, 32)
x = conv_bn(x, 32)
x = tnet(x, 32)
x = conv_bn(x, 32)
x = conv_bn(x, 64)
x = conv_bn(x, 512)
x = layers.GlobalMaxPooling1D()(x)
x = dense_bn(x, 1024)
x = layers.Dropout(0.3)(x)
x = dense_bn(x, 1024)
x = layers.Dropout(0.3)(x)
x = layers.Dense(NUM_POINTS * 3)(x)
outputs = layers.Reshape((NUM_POINTS, 3))(x)

modelMergedOut = Add()([outputs, inputs])

newModel = tf.keras.models.Model(inputs, modelMergedOut)
newModel.summary()

newModel.compile(
	loss=chamfer_distance_tf,
	optimizer=keras.optimizers.Adam(learning_rate=0.001)
)

newModel.fit(trainDataset, epochs=10, validation_data=testDataset)

predictions = newModel.predict(testScanPoints[:4])
visualizePredictions(testScanPoints[:4], testCADPoints[:4], predictions[:4])
