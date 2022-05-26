from os.path import join as joinPath
from os import mkdir  # TODO?: makedirs
from random import choices as randomChoices
from string import ascii_lowercase as letters
from string import digits
from werkzeug.datastructures import FileStorage
from typing import List

class File:
	def __init__(self, file: FileStorage, appRootPath: str, allowedExtensions: List[str], savingFolder: str, exportsFolder: str):
		self.appRootPath = appRootPath
		self.uploadedFile = file
		self.allowedExtensions = allowedExtensions
		self.savingFolder = savingFolder
		self.exportsFolder = exportsFolder

	def isExtensionAllowed(self):
		fileName = self.uploadedFile.filename
		return "." in fileName and fileName.split(".")[-1].lower() in self.allowedExtensions

	def save(self, dirName: str, version: int) -> (str, str):
		"""
		:returns saved file name
		"""
		fileExtension = self.uploadedFile.filename.split(".")[-1].lower()
		absoluteDirPath: str = self._getAbsoluteSavingPath(dirName)
		mkdir(absoluteDirPath)
		mkdir(joinPath(self.appRootPath, self.exportsFolder, dirName))
		fileName = f"v{version}.{fileExtension}"
		self.uploadedFile.save(joinPath(absoluteDirPath, fileName))
		return fileName, fileExtension

	def _getAbsoluteSavingPath(self, dirName: str):
		return joinPath(self.appRootPath, self.savingFolder, dirName)

	@staticmethod
	def getRandomString() -> str:
		return ''.join(randomChoices(letters + digits, k=16))
