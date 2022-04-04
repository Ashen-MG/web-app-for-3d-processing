import open3d as o3d
import zipfile
from config import ALLOWED_EXTENSIONS, ALLOWED_MESH_EXTENSIONS

def createConversions(filename: str, outputFilepath: str, convertTypes: list):
	model, isMesh = o3d.io.read_triangle_mesh(filename), True
	if len(model.triangles) == 0:
		model, isMesh = o3d.io.read_point_cloud(filename), False
	allowedExtensions = ALLOWED_MESH_EXTENSIONS if isMesh else ALLOWED_EXTENSIONS
	o3dWrite = o3d.io.write_triangle_mesh if isMesh else o3d.io.write_point_cloud
	convertedFiles = []  # absolute paths to converted files
	for extension in convertTypes:
		if extension in allowedExtensions:
			outputFilename = f"{outputFilepath}/converted.{extension}"
			o3dWrite(outputFilename, model)
			convertedFiles.append(outputFilename)
	if len(convertedFiles) != 0:
		createZip(f"{outputFilepath}/converted", convertedFiles)
		# TODO: clean everything except create zip

def createZip(outputZipFilename: str, convertedFiles: list):
	zipf = zipfile.ZipFile(f"{outputZipFilename}.zip", "w", zipfile.ZIP_DEFLATED)
	for file in convertedFiles:
		zipf.write(file, arcname=f"converted.{file.split('.')[-1]}")
	zipf.close()
