import base64
import os
import re
import zipfile
from typing import Dict

from flask import Flask, send_file, request
from flask_cors import CORS
from flask_socketio import SocketIO

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
app.config['CORS_HEADERS'] = 'Content-Type'
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

FileType = Dict[str, str]

def getFileData(file: FileType):
  pointCloudData = re.sub('^data:application/octet-stream;base64,', '', file["content"])
  return base64.b64decode(pointCloudData)

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

@app.route("/api/upload", methods=["POST"])
def upload():
  # TODO: validation
  # https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/
  file = request.files["file"]
  file.save(os.path.join(app.root_path, f"static/uploads/original.{file.filename.split('.')[-1]}"))
  return {}

@app.route("/api/algorithms/voxel-downsampling", methods=["POST"])
def voxel_downsampling():
  # https://flask.palletsprojects.com/en/2.0.x/patterns/fileuploads/
  voxelSize = request.json["voxelSize"]
  outputFilename = "static/processed_files/current.ply"
  voxelDownsampling("static/uploads/original.ply", outputFilename, voxelSize)
  return send_file(outputFilename)

# https://stackoverflow.com/questions/46805813/set-the-http-status-text-in-a-flask-response

if __name__ == '__main__':
  #socketio.run(app, debug=True, host="localhost", port=3001)
  app.run(debug=True, host="localhost", port=3001)