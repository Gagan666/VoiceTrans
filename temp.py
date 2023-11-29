import whisper
import time
from deep_translator import GoogleTranslator
from gtts import gTTS

class Models:
    def __init__(self, model_name="base"):
        self.model = whisper.load_model(model_name)

    def convert(self, from_lan, to_lan, file_name):
        print("Converting in progresss")
        result = self.model.transcribe(file_name)
        print(result["text"])
        translated = GoogleTranslator(source=from_lan, target=to_lan).translate(result["text"])
        tts = gTTS(translated, lang=to_lan)
        tts.save(file_name)
        print(result["text"] + "\t" + translated)

# Example usage:
models_instance = Models()
models_instance.convert("en", "hi", "123.mp3")
