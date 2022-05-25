import open3d as o3d
import zipfile
from config import ALLOWED_EXTENSIONS, ALLOWED_MESH_EXTENSIONS
from os import remove as removeFile
from random import random

def createConversions(filename: str, outputFilepath: str, convertTypes: list):
	model, isMesh = o3d.io.read_triangle_mesh(filename), True
	if len(model.triangles) == 0:
		model, isMesh = o3d.io.read_point_cloud(filename), False
	if isMesh:
		allowedExtensions = ALLOWED_MESH_EXTENSIONS
		o3dWrite = o3d.io.write_triangle_mesh
	else:
		allowedExtensions = ALLOWED_EXTENSIONS
		o3dWrite = o3d.io.write_point_cloud
	if "xyzrgb" in convertTypes and len(model.colors) == 0:  # without a paint, xyzrgb can't be saved
		model.paint_uniform_color([random(), random(), random()])
	convertedFiles = []  # absolute paths to converted files
	for extension in convertTypes:
		if extension in allowedExtensions:
			outputFilename = f"{outputFilepath}/converted.{extension}"
			o3dWrite(outputFilename, model)
			convertedFiles.append(outputFilename)
	if len(convertedFiles) != 0:
		createZip(f"{outputFilepath}/converted", convertedFiles)
		for file in convertedFiles:  # clean everything except created zip
			removeFile(file)

def createZip(outputZipFilename: str, convertedFiles: list):
	zipf = zipfile.ZipFile(f"{outputZipFilename}.zip", "w", zipfile.ZIP_DEFLATED)
	for file in convertedFiles:
		zipf.write(file, arcname=f"converted.{file.split('.')[-1]}")
	zipf.close()
