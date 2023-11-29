# app.py

from flask import Flask, render_template, request,send_from_directory
from flask_socketio import SocketIO, join_room, leave_room, emit
from pydub import AudioSegment
import base64
import io, time
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

import whisper
import time
from deep_translator import GoogleTranslator
from gtts import gTTS

class Models:
    def __init__(self, model_name="medium"):
        self.model = whisper.load_model(model_name)

    def convert(self, from_lan, to_lan, file_name):
        print("Converting in progresss")
        result = self.model.transcribe(file_name)
        print(result["text"])
        translated = GoogleTranslator(source=from_lan, target=to_lan).translate(result["text"])
        tts = gTTS(translated, lang=to_lan)
        tts.save(file_name)
        print(result["text"] + "\n" + translated)

model = Models()


room_users  ={}

@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)
    if room in room_users:
        room_users[room].append(data['username'])
    else:
        room_users[room] = [data['username']]
    emit('user-joined',{'username':data['username'],'users':room_users[room]}, room=room)





@socketio.on('leave')
def handle_leave(data):
    room = data['room']
    leave_room(room)
    print(data)
    if room in room_users:
        if data['username'] in room_users[room]:
            room_users[room].remove(data['username'])
            if not room_users[room]:
                del room_users[room]
    emit('user-left', {'username':data['username'],'users':room_users[room]}, room=room)

@socketio.on('voice_message')
def handle_voice_message(data):
    room = data['room']
    audio_blob = data['audioBlob']
    print(room)
    # Save the audio blob or handle it as needed
    # For simplicity, let's save it to a file

    filename = f"xx/audio_{time.mktime(time.localtime())}.mp3"

    with open(filename, 'wb') as audio_file:
        audio_file.write(base64.b64decode(audio_blob))
    model.convert(from_lan="en", to_lan="hi", file_name=filename)

    # Broadcast the message to all clients in the room
    emit('voice_message', {'username': data['username'], 'audioUrl': filename}, room=room)

@app.route('/<path:filename>')
def serve_audio(filename):
    print(filename)
    return send_from_directory('', filename)
if __name__ == '__main__':
    socketio.run(app, debug=True)
