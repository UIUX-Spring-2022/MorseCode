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
    return render_template('welcome.html')
#we probably need to divide the templates for learn and quiz into learn_1, learn_2 etc based on different layouts for learning/quizzing

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/learn_letters/1')
def learn_letters():
    global learn_combos
    return render_template('learn_letters_1.html', learn_combos=learn_combos)

@app.route('/learn_letters/2')
def learn_letters_2():
    global learn_combos_2
    return render_template('learn_letters_2.html', learn_combos_2=learn_combos_2)

@app.route('/learn/<id>')
def learn(id):
    return render_template('learn.html', id=id)

@app.route('/quiz/<id>')
def quiz(quiz_id):
    return render_template('quiz.html', quiz_id=quiz_id)

if __name__ == '__main__':
   app.run(debug = True)
