from matplotlib import pyplot as plt
import matplotlib.cm as cm
from scipy import spatial

SMALL_SIZE = 8
MEDIUM_SIZE = 10
BIGGER_SIZE = 12

# adjust font sizes (https://stackoverflow.com/questions/3899980/how-to-change-the-font-size-on-a-matplotlib-plot)
plt.rc('font', size=BIGGER_SIZE)          # controls default text sizes
plt.rc('axes', titlesize=BIGGER_SIZE)     # fontsize of the axes title
plt.rc('axes', labelsize=BIGGER_SIZE)    	# fontsize of the x and y labels
plt.rc('xtick', labelsize=BIGGER_SIZE)    # fontsize of the tick labels
plt.rc('ytick', labelsize=BIGGER_SIZE)    # fontsize of the tick labels
plt.rc('legend', fontsize=BIGGER_SIZE)    # legend fontsize
plt.rc('figure', titlesize=BIGGER_SIZE)  	# fontsize of the figure title

def visualizeHeatPC(scan, gt):
	fig = plt.figure(figsize=(5, 5))
	ax = fig.add_subplot(111, projection="3d")
	gtKDTree = spatial.KDTree(gt)
	distances, indexes = gtKDTree.query(scan)
	ax.scatter(scan[:, 0], scan[:, 1], scan[:, 2], c=distances, cmap=cm.jet)
	plt.show()

def visualizeOnePC(pc, filename="prediction", axisOff=True):
	fig = plt.figure(figsize=(10, 10))
	ax = fig.add_subplot(111, projection="3d")
	ax.scatter(pc[:, 0], pc[:, 1], pc[:, 2])
	if axisOff:
		ax.set_axis_off()
	plt.savefig(f"{filename}.png")
	plt.show()

def visualizeTwoPCs(scan, gt):
	fig = plt.figure(figsize=(5, 5))
	ax = fig.add_subplot(111, projection="3d")
	ax.set_title("scan")
	ax.scatter(scan[:, 0], scan[:, 1], scan[:, 2])
	fig2 = plt.figure(figsize=(5, 5))
	ax2 = fig2.add_subplot(111, projection="3d")
	ax2.set_title("ground truth")
	ax2.scatter(gt[:, 0], gt[:, 1], gt[:, 2])
	plt.show()

def visualizePredictions(train, gt, pred):
	fig = plt.figure(figsize=(15, 10))
	for i in range(len(pred)):
		ax = fig.add_subplot(3, len(pred), i + 1, projection="3d")
		ax.scatter(train[i, :, 0], train[i, :, 1], train[i, :, 2])
		ax.set_axis_off()
		ax = fig.add_subplot(3, len(pred), (i + 1) + len(pred), projection="3d")
		ax.scatter(gt[i, :, 0], gt[i, :, 1], gt[i, :, 2])
		ax.set_axis_off()
		ax = fig.add_subplot(3, len(pred), (i + 1) + 2 * len(pred), projection="3d")
		ax.scatter(pred[i, :, 0], pred[i, :, 1], pred[i, :, 2])
		ax.set_axis_off()
	plt.savefig("predictions.png")
	plt.show()

def visualizeHistory(history, loss_only: bool = False, title="Model Loss"):
	plt.figure(figsize=(10, 5))
	plt.plot(history.history['loss'])
	if not loss_only:
		plt.plot(history.history['val_loss'])
	if title is not None:
		plt.title(title)
	plt.ylabel('Loss')
	plt.xlabel('Epoch')
	plt.legend(['Training', 'Validation'], loc='upper right')
	plt.savefig("history.png")
	plt.show()
