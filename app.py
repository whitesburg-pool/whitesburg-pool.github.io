#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import sys
import os
import site
lib_dir = os.path.join(os.path.dirname(__file__), "python-lib")
site.addsitedir(lib_dir)

from flask import Flask
from wsgiref.handlers import CGIHandler

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

CGIHandler().run(app)
