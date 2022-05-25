from functools import wraps
from flask import request

def hasRequiredJsonParameters(*parameters):
	def decoratedFunction(f):
		@wraps(f)
		def wrapper(*args, **kwargs):
			if not request.json:
				return {"message": "Missing JSON parameters."}, 400
			for p in parameters:
				if p not in request.json:
					return {"message": f"Missing `{p}` parameter."}, 400
			return f(*args, **kwargs)
		return wrapper
	return decoratedFunction
