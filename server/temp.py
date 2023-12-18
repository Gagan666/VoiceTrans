# import whisper
# import time
# from deep_translator import GoogleTranslator
# from gtts import gTTS

# class Models:
#     def __init__(self, model_name="base"):
#         self.model = whisper.load_model(model_name)
#     def convert(self, from_lan, to_lan, file_name):
#         print("Converting in progresss")
#         start = time.time()
#         result = self.model.transcribe(file_name)
#         end = time.time()
#         print(result["text"],' ',end-start)
#         translated = GoogleTranslator(source=from_lan, target=to_lan).translate(result["text"])
#         tts = gTTS(translated, lang=to_lan)
#         tts.save(file_name)
#         print(result["text"] + "\t" + translated)

# # Example usage:
# models_instance = Models()
# models_instance.convert("en", "hi", "2.mp4")
# import torch
# from transformers import pipeline
# from deep_translator import GoogleTranslator
# from gtts import gTTS
# import time
# # path to the audio file to be transcribed
# # from google.colab import drive
# # drive.mount('/content/drive')
# audio = "2.mp4"
# device = "cuda:0" if torch.cuda.is_available() else "cpu"
# print(device)
# transcribe = pipeline(task="automatic-speech-recognition", model="vasista22/whisper-hindi-small", chunk_length_s=30,device=device)
# transcribe.model.config.forced_decoder_ids = transcribe.tokenizer.get_decoder_prompt_ids(language="hi", task="transcribe")
# start = time.time()
# result=transcribe(audio)['text']
# # print('Transcription: ', result)
# translated = GoogleTranslator(source='hi', target='en').translate(result)
# print(translated)
# tts = gTTS(translated, lang="hi")
# tts.save("2.mp4")
# end = time.time()
# print(end-start)

import torch
import torchaudio
from datasets import load_dataset,Dataset
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

Dataset.cleanup_cache_files
test_dataset = load_dataset("common_voice", "hi", split="test[:2%]",download_mode="force_redownload")
processor = Wav2Vec2Processor.from_pretrained("theainerd/Wav2Vec2-large-xlsr-hindi")
model = Wav2Vec2ForCTC.from_pretrained("theainerd/Wav2Vec2-large-xlsr-hindi")
resampler = torchaudio.transforms.Resample(48_000, 16_000)

# Preprocessing the datasets.
# We need to read the aduio files as arrays
def speech_file_to_array_fn(batch):
  speech_array, sampling_rate = torchaudio.load(batch["path"])
  batch["speech"] = resampler(speech_array).squeeze().numpy()
  return batch

test_dataset = test_dataset.map(speech_file_to_array_fn)
inputs = processor(test_dataset["speech"][:2], sampling_rate=16_000, return_tensors="pt", padding=True)

with torch.no_grad():
  logits = model(inputs.input_values, attention_mask=inputs.attention_mask).logits

predicted_ids = torch.argmax(logits, dim=-1)

print("Prediction:", processor.batch_decode(predicted_ids))
print("Reference:", test_dataset["sentence"][:2])