from os.path import join as joinPath
from os import mkdir
from random import choices as randomChoices
from string import ascii_lowercase as letters
from string import digits
from werkzeug.datastructures import FileStorage
from config import ALLOWED_EXTENSIONS, SAVING_FOLDER

class File:
	def __init__(self, appRootPath: str, file: FileStorage):
		self.appRootPath = appRootPath
		self.uploadedFile = file

	def isExtensionAllowed(self):
		fileName = self.uploadedFile.filename
		return "." in fileName and fileName.split(".")[-1].lower() in ALLOWED_EXTENSIONS

	def save(self, dirName: str, version: int) -> (str, str):
		""" :returns saved file name """
		fileExtension = self.uploadedFile.filename.split(".")[-1].lower()
		absoluteDirPath: str = self._getAbsoluteSavingPath(dirName)
		mkdir(absoluteDirPath)
		fileName = f"v{version}.{fileExtension}"
		self.uploadedFile.save(joinPath(absoluteDirPath, fileName))
		return fileName, fileExtension

	def _getAbsoluteSavingPath(self, dirName: str):
		return joinPath(self.appRootPath, SAVING_FOLDER, dirName)

	def getRandomString(self) -> str:
		return ''.join(randomChoices(letters + digits, k=16))
