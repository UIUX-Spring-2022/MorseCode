from inspect import isdatadescriptor
from flask import Flask
from flask import render_template, url_for, redirect
from flask import Response, request, jsonify
app = Flask(__name__)

#insert data and everything here