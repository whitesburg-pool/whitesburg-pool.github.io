#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import sys
import os
import site
lib_dir = os.path.join(os.path.dirname(__file__), "python-lib")
site.addsitedir(lib_dir)
this_dir = os.path.dirname(__file__)
site.addsitedir(this_dir)

from app import app
from wsgiref.handlers import CGIHandler

CGIHandler().run(app)

