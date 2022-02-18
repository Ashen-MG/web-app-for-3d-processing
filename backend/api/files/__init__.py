from os.path import join as pathJoin
from os import mkdir
from random import choices as randomChoices
from string import ascii_lowercase as letters
from string import digits
from werkzeug.datastructures import FileStorage

class File:
	SAVING_FOLDER = r"static\uploads"
	ALLOWED_EXTENSIONS = {"ply", "pcd", "xyz", "xyzrgb"}

	def __init__(self, appRootPath: str, file: FileStorage):
		self.appRootPath = appRootPath
		self.uploadedFile = file

	def isExtensionAllowed(self):
		fileName = self.uploadedFile.filename
		return "." in fileName and fileName.split(".")[-1].lower() in self.ALLOWED_EXTENSIONS

	def save(self, version=1) -> str:
		""" :returns saved file name """
		fileExtension = self.uploadedFile.filename.split(".")[-1].lower()
		randomDirName = self._getRandomString()
		absoluteDirPath: str = self._getAbsoluteSavingPath(randomDirName)
		mkdir(absoluteDirPath)
		fileName = f"v{version}.{fileExtension}"
		self.uploadedFile.save(pathJoin(absoluteDirPath, fileName))
		return fileName

	def _getAbsoluteSavingPath(self, dirName: str):
		return pathJoin(self.appRootPath, self.SAVING_FOLDER, dirName)

	def _getRandomString(self) -> str:
		return ''.join(randomChoices(letters + digits, k=16))
