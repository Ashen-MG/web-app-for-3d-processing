import base64
import os
import re
import zipfile
from typing import Dict
from shutil import copyfile
import random
import endpoints.upload

from flask import Flask, send_file, request, url_for, redirect
from flask_cors import CORS
# from flask_socketio import SocketIO

#from flask_jwt_extended import create_access_token
#from flask_jwt_extended import JWTManager
from datetime import timedelta

from convert import createConversions
from algorithms.analytical.voxel_downsampling import voxelDownsampling

"""
Payload.max_decode_packets = 50000
SocketIO(async_mode="gevent", ping_timeout=100000, pong_timeout=100000)
"""

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sasdfdsfgd'
CORS(app, resources={ r'/*': {'origins': [
    'http://localhost:3000', '*'  # React
      # React
  ]}}, supports_credentials=True)

# Load config
app.config.from_pyfile("config.py")

app.config['CORS_HEADERS'] = 'Content-Type'
# socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

""" JWT tokens setup. """
"""
app.config["JWT_SECRET_KEY"] = "dev secret key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=72)
jwt = JWTManager(app)
"""

FileType = Dict[str, str]

def getAccessToken():  # TODO
  ...

def getFileData(file: FileType):
  pointCloudData = re.sub('^data:application/octet-stream;base64,', '', file["content"])
  return base64.b64decode(pointCloudData)

"""
@socketio.on("fileUpload")
def handle_json(file: FileType):
  fileContent = getFileData(file)
  with open("frontend.ply", 'wb') as f:
    f.write(fileContent)

@socketio.on("convert")  # this won't work (socketio doesn't work this way)
def convert():
  # TODO: conversion
  zipf = zipfile.ZipFile("converted.zip", "w", zipfile.ZIP_DEFLATED)
  for root, dirs, files in os.walk("../testing/open3d_testing/export"):
    for file in files:
      zipf.write(f"../testing/open3d_testing/export{file}")
  zipf.close()
  return send_file("../converted.zip",
    mimetype="zip",
    download_name="converted.zip",
    as_attachment=True
  )
"""

@app.route("/download")
def download():
  zipf = zipfile.ZipFile("converted.zip", "w", zipfile.ZIP_DEFLATED)
  for root, dirs, files in os.walk("testing/open3d_testing/export/"):
    for file in files:
      zipf.write(f"testing/open3d_testing/export/{file}", arcname=file)
  zipf.close()
  return send_file("../converted.zip",
                   mimetype="zip",
                   download_name="converted.zip",
                   as_attachment=True
   )

@app.route("/api/convert", methods=["POST"])
def convert():
  convertTypes = request.json["convertTypes"]
  filepath = os.path.join(app.root_path, "static/uploads/current.ply")  # todo
  createConversions(filepath, os.path.join(app.root_path, "static/export"), convertTypes)
  return {
    "fileURL": url_for("static", filename="export/converted.zip")
  }

app.add_url_rule(
	"/api/upload",
	view_func=endpoints.upload.UploadView.as_view("upload"),
	methods=["POST"]
)

# TODO?: each algorithm could take parameters: version, token (dirname)

# TODO: different extension
@app.route("/api/algorithms/voxel-downsampling", methods=["POST"])
def voxel_downsampling():
  # https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/
  voxelSize = request.json["voxelSize"]
  filepath = os.path.join(app.root_path, "static/uploads/current.ply")
  voxelDownsampling(filepath, filepath, voxelSize)

  return {
    "fileURL": url_for("static", filename="uploads/current.ply") + f"?v={''.join([str(random.randint(0, 100)) for _ in range(30)])}"
  }
  # return send_file(filename)

# https://stackoverflow.com/questions/46805813/set-the-http-status-text-in-a-flask-response

if __name__ == '__main__':
  #socketio.run(app, debug=True, host="localhost", port=3001)
  app.run(debug=True, host="localhost", port=3001)