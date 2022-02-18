"""
Do not import from this file!
Config is loaded to an instance of flask application in api/app.py
e.g. access by app.config["varName"] or in the context of a request in external file by
importing `from flask import current_app` and accessing in the same way i.e. current_app.config["varName"].
"""

UPLOADS_FOLDER = "uploads"
SAVING_FOLDER = fr"static\{UPLOADS_FOLDER}"
ALLOWED_EXTENSIONS = {"ply", "pcd", "xyz", "xyzrgb"}
