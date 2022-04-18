import os

from flask import Flask
from flask import render_template, url_for, redirect
from flask import Response, request, jsonify
from flask import json
from operator import itemgetter

app = Flask(__name__)


data_json = os.path.join(app.static_folder, 'data.json')
with open(data_json) as morse_data:
    data = json.load(morse_data)
    letter_sounds = data["sounds"]

learn_combos= ['A', 'E','M','S']
learn_combos_2 = ['I','N','T','O']

@app.route('/')
def welcome():
    return render_template('index.html')
#we probably need to divide the templates for learn and quiz into learn_1, learn_2 etc based on different layouts for learning/quizzing

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/learn/<id>')
def learn_letters(id):
    global learn_combos, learn_combos_2
    lesson = learn_combos if id == 1 else learn_combos_2
    return render_template('learn_letters_1.html', learn_combos=lesson)

@app.route('/learn/<id>')
def learn(id):
    return render_template('learn.html', id=id)

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/question/<id>')
def question(id):
    return render_template('question.html', id=id)

if __name__ == '__main__':
   app.run(debug = True)
