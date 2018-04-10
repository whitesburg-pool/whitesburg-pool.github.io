#!/usr/bin/env python2
# -*- coding: UTF-8 -*-

# enable debugging
import sys
import os
sys.path.append(os.path.dirname(__file__))

from bottle import route, run, template

@route('/')
def index():
    return "hello world"

@route('/test')
def index():
    return "hello test"

run(server="cgi")

