from inspect import isdatadescriptor
from flask import Flask
from flask import render_template, url_for, redirect
from flask import Response, request, jsonify
app = Flask(__name__)

#insert data and everything here

@app.route('/')
def welcome():
    return render_template('welcome.html')
#we probably need to divide the templates for learn and quiz into learn_1, learn_2 etc based on different layouts for learning/quizzing

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/edit/<id>')
def learn(id):
    return render_template('learn.html', id=id)

@app.route('/quiz/<id>')
def quiz(quiz_id):
    return render_template('quiz.html', quiz_id=quiz_id)

if __name__ == '__main__':
   app.run(debug = True)
