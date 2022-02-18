import open3d as o3d
import zipfile
from config import ALLOWED_EXTENSIONS

def createConversions(filename: str, outputFilepath: str, convertTypes: list):
	pcd = o3d.io.read_point_cloud(filename)
	convertedFiles = []  # absolute paths to converted files
	for extension in convertTypes:
		if extension in ALLOWED_EXTENSIONS:
			outputFilename = f"{outputFilepath}/converted.{extension}"
			o3d.io.write_point_cloud(outputFilename, pcd)
			convertedFiles.append(outputFilename)
	if len(convertedFiles) != 0:
		createZip(f"{outputFilepath}/converted", convertedFiles)

def createZip(outputZipFilename: str, convertedFiles: list):
	zipf = zipfile.ZipFile(f"{outputZipFilename}.zip", "w", zipfile.ZIP_DEFLATED)
	for file in convertedFiles:
		zipf.write(file, arcname=f"converted.{file.split('.')[-1]}")
	zipf.close()
