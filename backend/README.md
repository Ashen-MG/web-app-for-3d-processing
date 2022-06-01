## Installation
Create Python virtual environment from 
Python 3.7.6. (or 3.7.7. if distribution versions of python libraries don't exist)
```
python -m venv venv
```
or
```
python3 -m venv venv
```
Update pip
```
python -m pip install --upgrade pip
```
Install dependencies from `requirements.txt`
```
pip install -r requirements.txt
```
Notes:
- Prerequisites for open3d on Ubuntu: `apt-get install ffmpeg libsm6 libxext6 -y`
- Skip installations of `pywin32` and `pywinpty` included in the `requirements.txt`
  on Linux.

## Development
In created python venv run
```
python api/app.py dev
```
Note: python api/app.py prod might be useful to simulate the production version 
during the development but Flask 
doesn't recommend it as a real production server 
(see <a href="#deployment-ubuntu-linux">Deployment</a> section).

### Conventions
Endpoints are defined as rules in `api/app.py` by filling up url, view, and 
request methods. Endpoint view classes are defined in 
`api/endpoints/endpoint_name/__init__.py`.

All algorithms available within the back-end are generalized with 
`AlgorithmView` class with one PUT method in 
`api/endpoints/algorithms/__init__.py`.

Therefore, defining a new endpoint with functionality different that a new
algorithm should be made in `api/endpoints` folder. Its functionality is
then coded directly in the view or in an external class/function
(i.e. `api/new_functionality_name/__init__.py`).

If adding a new algorithm is desired, create a rule and use `AlgorithmView`
```python
app.add_url_rule(
	"/api/algorithms/new-algorithm-name",
	view_func=endpoints.algorithms.AlgorithmView.as_view(
        "new_algorithm_name",
        algorithmFunction,  # reference
        "algorithmFunctionArg1", "algorithmFunctionArg2", ..., "algorithmFunctionArgN"
    ),
	methods=["PUT"]
)
```
where `algorithmFunction` should be specified in 
`api/algorithms/new_algorithm_name/__init__.py` with arguments
```python
algorithmFunction(currentFilePath: str, outputFilepath: str, algorithmFunctionArg1, algorithmFunctionArg2, ..., algorithmFunctionArgN)
```
where `algorithmFunctionArg1, algorithmFunctionArg2, ..., algorithmFunctionArgN`
are names (keys) of request JSON parameters that this algorithm (route) takes.

## State of an uploaded 3D model
Uploading a new 3D model (i.e. using upload endpoint) results in the
following response (state)
```
{
    fileExtension: "ply" | "pcd" | "xyz" | "xyzrgb" | "pts",
    token: "random token",
    version: 1,
    highestVersion: 1
}
```
where the above state is used to access the file in a format
`api/static/uploads/token/version.fileExtension`.
By applying an algorithm, the API returns a new state, where `token` stays
the same, `fileExtension` might change, `version` and `highestVersion`
are `previous version + 1` (`highestVersion` is there due to the frequent
use on the front-end, but can be omitted in external use).

## API documentation
Documentation is maintained with Swagger (OpenAPI) using flasgger.
Learn more about each endpoint by visiting `/apidocs`.

## Deployment (ubuntu linux)
Do <a href="#installation">Installation</a> on a remote server.

Install
```
apt install gunicorn3
apt install nginx
```

Gunicorn might be needed to install in venv
```
pip install gunicorn
```
and using it from `venv/bin/gunicorn`.

By running
```
gunicorn3 -b 0.0.0.0:API_PORT_NUMBER app:app
```
from `api` directory we start a WSGI HTTP production server.
Ideally, run the gunicorn3 WSGI server automatically in the 
background e.g. by using a bash script
```
#!/bin/bash

APP_PATH=PATH_TO_BACKEND_DIR
exec PATH_TO_GUNICORN --chdir ${APP_PATH} app:app -b 0.0.0.0:API_PORT_NUMBER
```

Nginx can be used as a web server and reverse proxy for the gunicorn server.
Add nginx configuration in `/etc/nginx/sites-available/` that should
link to `/etc/nginx/sites-enabled/`. Example of nginx configuration for the back-end and front-end 
deployment:
```
server {
    # SSL configuration
    listen PORT_NUMBER ssl;
    listen [::]:PORT_NUMBER ssl;
    ssl_certificate     PATH/fullchain.pem;
    ssl_certificate_key PATH/privkey.pem;
    
    client_max_body_size 1000M;

    root PATH_TO_FRONTEND_BUILD;

    index index.html;
    
    server_name DOMAIN_NAME_OR_IP;
    
    location / {
        try_files $uri /index.html;
    }
  
    location ~ ^/(api|static/uploads|static/exports|apidocs|flasgger_static)/ {
        proxy_pass http://localhost:API_PORT_NUMBER;
    }
  
    location /apispec.json {
        proxy_pass http://localhost:API_PORT_NUMBER;
    }
}
```

### Tips
- Letsencrypt certificates are easy to generate in nginx configuration with a certbot --nginx util.
- Supervisor or similar tools are useful to automatically control gunicorn.