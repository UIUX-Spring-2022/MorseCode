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

learn_combos= ["A", "E", "M", "S"]

sounds_1 = [letter_sounds[0]["link"],letter_sounds[1]["link"],letter_sounds[4]["link"],letter_sounds[6]["link"]]

learn_combos_2 = ["I","N","T","O"]

sounds_2 = [letter_sounds[2]["link"],letter_sounds[5]["link"],letter_sounds[7]["link"],letter_sounds[3]["link"]]


@app.route('/')
def welcome():
    return render_template('welcome.html')
#we probably need to divide the templates for learn and quiz into learn_1, learn_2 etc based on different layouts for learning/quizzing

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/learn_letters/<id>')
def learn_letters(id):
    global learn_combos, learn_combos_2, sounds_1, sounds_2
    lesson = learn_combos if id == "1" else learn_combos_2
    files = sounds_1 if id == "1" else sounds_2
    id = int(id)+1 #add one
    id = str(id) #back to string
    url = "/learn_letters/2" if id == "2" else "/learn/3"
    return render_template('learn_letters.html', learn_combos=lesson, files=files, id=id, url=url)

@app.route('/learn/<id>')
def learn(id):
    global letter_sounds
    if int(id) == 3 or int(id) == 5:
        letter = "A" if int(id) == "3" else "S"
        sound = letter_sounds[0]["link"] if int(id) == "3" else letter_sounds[6]["link"]
        id = int(id)+1
        id = str(id)
        return render_template('learn_type_a.html', id=id, letter=letter, sound=sound)
    else:
        id = int(id)+1
        id = str(id)
        return render_template('learn_type_b.html', id=id)
# READ HERE
# learn type a is for slides 4/7 and 6/7 of learn because they're the same format
# learn type b is for slides 5/7 and 7/7 of learn because they're the same format

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/question/<id>')
def question(id):
    return render_template('question.html', id=id)

if __name__ == '__main__':
   app.run(debug = True)
