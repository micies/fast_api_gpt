import os

import speech_recognition as sr
import openai
import pyttsx3
import translators as ts
from dotenv import load_dotenv

load_dotenv()
API_CHATGPT = os.getenv('API_CHATGPT')

openai.api_key = API_CHATGPT


def set_speech():
    r = sr.Recognizer()

    with sr.Microphone() as source:
        print("Speak now: ")
        audio = r.listen(source)
        try:
            text = r.recognize_google(audio)
            insert_in_chatGPT(text)

            print(f"You said: {text}")
        except Exception as e:
            print(e)
            print("Speak nothing")


def insert_in_chatGPT(chat: str) -> dict[str]:
    """

    :param chat: The question sent to chatGPT
    :return:
        The answer from chatGPT
    """
    print(chat)
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=chat,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    res = response["choices"][0]["text"]

    translate_in_hebrew = ts.translate_text(res, to_language='he')
    print(translate_in_hebrew)
    return {"en": res, "he": translate_in_hebrew}



def get_speech(text):
    engine = pyttsx3.init()
    engine.say(text)    
    engine.runAndWait()


if __name__ == "__main__":
    set_speech()
