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
    words = data["words"]

learn_combos= ["A", "E", "M", "S"]

sounds_1 = [letter_sounds[0]["link"],letter_sounds[1]["link"],letter_sounds[4]["link"],letter_sounds[6]["link"]]

learn_combos_2 = ["I","N","T","O"]

sounds_2 = [letter_sounds[2]["link"],letter_sounds[5]["link"],letter_sounds[7]["link"],letter_sounds[3]["link"]]

results = []

def get_score():
    global results
    score = 0
    for answer in results:
        if answer:
            score += 1
    return score

@app.route('/')
def welcome():
    return render_template('index.html')
#we probably need to divide the templates for learn and quiz into learn_1, learn_2 etc based on different layouts for learning/quizzing

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/learn_letters/<id>')
def learn_letters(id):
    global learn_combos, learn_combos_2, sounds_1, sounds_2
    lesson = learn_combos if id == "1" else learn_combos_2
    files = sounds_1 if id == "1" else sounds_2
    codes=[]
    for x in letter_sounds:
        letter= x['letter'].upper()
        if letter in lesson:
            codes.append(x['code'])
    id = int(id)+1 #add one
    id = str(id) #back to string
    url = "/learn_letters/2" if id == "2" else "/learn/0"
    prev_url= "/learn_letters/1" if id=="3" else "/about"
    return render_template('learn_letters.html', learn_combos=lesson, files=files, id=id, url=url, codes=codes, prev_url=prev_url)

@app.route('/learn/<id>')
def learn(id):
    global letter_sounds
    if int(id)%2!=0:
        letter= letter_sounds[int(id)]["letter"].upper()
        sound = letter_sounds[int(id)]["link"]
        code= letter_sounds[int(id)]["code"]
        next_id = int(id)+1
        page_id = next_id+2
        url= "/learn/" + str(next_id)
        prev_id= int(id)-1
        prev_url= "/learn/" + str(prev_id)
        if next_id==8:
            url= "/quiz"
        return render_template('learn_type_a.html', id=id, letter=letter, sound=sound, code=code, url=url, page_id=page_id, prev_url=prev_url) 
    else:
        letter= letter_sounds[int(id)]["letter"].upper()
        sound = letter_sounds[int(id)]["link"]
        code= letter_sounds[int(id)]["code"]
        next_id = int(id)+1
        page_id=next_id+2
        url= "/learn/" + str(next_id)
        prev_id= int(id)-1
        prev_url= "/learn/" + str(prev_id)
        if prev_id==-1:
            prev_url="/learn_letters/2"
        return render_template('learn_type_b.html', id=id, letter=letter, sound=sound, code=code, url=url, page_id=page_id, prev_url=prev_url)
# READ HERE
# learn type a is for slides 4/7 and 6/7 of learn because they're the same format
# learn type b is for slides 5/7 and 7/7 of learn because they're the same format

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/question/<id>')
def question(id):
    global letter_sounds, words
    return render_template('question.html', letters=letter_sounds, words=words, id=int(id))

@app.route('/update', methods=['POST'])
def update():
    global results
    answer = request.get_json()
    print(answer)
    results.append(answer)

    return jsonify(score=get_score())

@app.route('/end')
def end():
    global results
    result = get_score()
    results = []
    return render_template('end.html', result=result)

if __name__ == '__main__':
   app.run(debug = True)
