"""
Config is loaded to an instance of flask application in api/app.py.
Access by app.config["varName"] or in the context of a request in an external file by
importing `from flask import current_app` and calling current_app.config["varName"].
"""

UPLOADS_FOLDER = "uploads"
SAVING_FOLDER = fr"static\{UPLOADS_FOLDER}"
EXPORTS_FOLDER = fr"static\exports"
ALLOWED_EXTENSIONS = {"ply", "pcd", "xyz", "xyzrgb", "pts"}
ALLOWED_MESH_EXTENSIONS = {"ply"}
