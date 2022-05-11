

class FileState:
	def __init__(self, jsonRequest):
		if not jsonRequest:
			...
		if any(param not in jsonRequest for param in ("token", "version", "fileExtension")):
			...
		self.token = jsonRequest["token"]
		self.currentVersion = jsonRequest["version"]
		self.fileExtension = jsonRequest["fileExtension"]
