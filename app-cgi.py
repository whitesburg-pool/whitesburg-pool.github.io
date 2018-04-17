#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import sys
import os
import site
this_dir = os.path.dirname(__file__)
site.addsitedir(this_dir)

from app import app
from wsgiref.handlers import CGIHandler

CGIHandler().run(app)

