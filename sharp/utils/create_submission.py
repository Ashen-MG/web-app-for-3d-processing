import os
from glob import glob
import shutil
from config import DATA_DIR, DATA_SCANS_DIR

def createSubmission(predictionsDir: str, edgesDir: str, submissionDir: str, mode: str):
	"""
	Join predictions with edges to submission format.
	https://gitlab.uni.lu/cvi2/cvpr2022-sharp-workshop/-/blob/master/doc/challenge_2.md#submission-format
	`predictionsDir` & `edgesDir` must follow the same directory structure as scans and cads.
	`submissionDir` should be empty.
	`mode` is "train", "test" or "eval".
	"""
	predictionFiles = glob(os.path.join(predictionsDir, f"{mode}/*/*/*"))
	edgeFiles = glob(os.path.join(edgesDir, f"{mode}/*/*/*"))
	for i in range(len(predictionFiles)):
		pf = predictionFiles[i].split("\\")
		submissionPrediction = os.path.join(submissionDir, "\\".join(pf[-4:]).replace(".ply", "-reconstructed.ply"))
		ef = edgeFiles[i].split("\\")
		edgesPrediction = os.path.join(submissionDir, "\\".join(ef[-4:]).replace(".ply", "-edges.ply"))
		dir = os.path.dirname(submissionPrediction)
		if not os.path.exists(dir):
			os.makedirs(dir)
		shutil.copy(predictionFiles[i], submissionPrediction)
		shutil.copy(edgeFiles[i], edgesPrediction)
		print(f"{i+1}/{len(predictionFiles)}", end="\r")
	print()

if __name__ == "__main__":
	createSubmission(
		DATA_SCANS_DIR,
		os.path.join(DATA_DIR, "cc3d_pse_scan_edges"),
		os.path.join(DATA_DIR, "submission"),
		"test"
	)
