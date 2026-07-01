import json
import logging
import os
import re
import sys

import numpy as np
import nltk

# --- Keras 3 compatibility: allow legacy .h5 layers and strip deprecated GRU args ---
import keras
from keras.models import load_model # or tensorflow.keras.models

# 1. Dynamically find the absolute path of the directory containing PipeLined.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. Map paths using absolute joins so it resolves identically on both Windows and Linux containers
HATE_MODEL_PATH = os.path.join(BASE_DIR, 'hate_model.h5')
SPAM_MODEL_PATH = os.path.join(BASE_DIR, 'spam_model.h5')
HATE_TOKENIZER_PATH = os.path.join(BASE_DIR, 'tokenizer_hate.json')
SPAM_TOKENIZER_PATH = os.path.join(BASE_DIR, 'tokenizer_spam.json')
keras.config.enable_unsafe_deserialization()

if hasattr(keras, "src"):
    def _patch_rnn_init(cls):
        _orig_init = cls.__init__

        def _init_no_legacy(self, *args, **kwargs):
            kwargs.pop("time_major", None)
            return _orig_init(self, *args, **kwargs)

        cls.__init__ = _init_no_legacy

    for _name in ("GRU", "LSTM", "SimpleRNN"):
        for _mod in (
            keras.src.layers.rnn.gru,
            keras.src.layers.rnn.lstm,
            keras.src.layers.rnn.simple_rnn,
        ):
            if hasattr(_mod, _name):
                _patch_rnn_init(getattr(_mod, _name))

from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json

logging.basicConfig(level=logging.ERROR)
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")


def download_nltk_data():
    for resource in ("punkt", "punkt_tab", "wordnet", "stopwords"):
        try:
            if resource in ("punkt", "punkt_tab"):
                nltk.data.find(f"tokenizers/{resource}")
            else:
                nltk.data.find(f"corpora/{resource}")
        except LookupError:
            nltk.download(resource, quiet=True)


def load_tokenizer(path):
    with open(path, encoding="utf-8") as f:
        payload = json.load(f)
    # Files store a JSON-encoded string wrapping the Keras tokenizer config
    if isinstance(payload, str):
        payload = json.loads(payload)
    return tokenizer_from_json(json.dumps(payload))


def processed(text) -> list:
    cont_patterns = [
        (r"(W|w)on't", "will not"),
        (r"(C|c)an't", "can not"),
        (r"(I|i)'m", "i am"),
        (r"(A|a)n't", "is not"),
        (r"(\w+)'ll", r"\g<1> will"),
        (r"(\w+)n't", r"\g<1> not"),
        (r"(\w+)'ve", r"\g<1> have"),
        (r"(\w+)'s", r"\g<1> is"),
        (r"(\w+)'re", r"\g<1> are"),
        (r"(\w+)'d", r"\g<1> would"),
    ]
    patterns = [(re.compile(regex), repl) for regex, repl in cont_patterns]
    text = text.lower()
    for pattern, repl in patterns:
        text = re.sub(pattern, repl, text)
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z]", " ", text)
    text = " ".join(text.split())
    stopwords_set = set(stopwords.words("english"))
    lemmatizer = WordNetLemmatizer()
    tokens = [word for word in word_tokenize(text) if word not in stopwords_set]
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    return [tokens] if tokens else [[""]]


def get_ratings(text, hate_model, spam_model, tokenizer_hate, tokenizer_spam):
    vec = processed(text)
    vec_hate = np.array(tokenizer_hate.texts_to_sequences(vec))
    vec_spam = np.array(tokenizer_spam.texts_to_sequences(vec))
    vec_hate = pad_sequences(vec_hate, maxlen=2000)
    vec_spam = pad_sequences(vec_spam, maxlen=2000)
    hate_rating = float(100 * hate_model.predict(vec_hate, verbose=0)[0, 0])
    spam_rating = float(100 * spam_model.predict(vec_spam, verbose=0)[0, 0])
    return hate_rating, spam_rating


def main():
    comment_text = sys.argv[1] if len(sys.argv) > 1 else ""
    
    # Run our verification data check
    download_nltk_data()

    # =====================================================================
    # UPDATE THESE LINES TO USE THE UPPERCASE CONFIG PATHS
    # =====================================================================
    hate_model = load_model(
        HATE_MODEL_PATH, compile=False, safe_mode=False
    )
    spam_model = load_model(
        SPAM_MODEL_PATH, compile=False, safe_mode=False
    )

    tokenizer_hate = load_tokenizer(HATE_TOKENIZER_PATH)
    tokenizer_spam = load_tokenizer(SPAM_TOKENIZER_PATH)
    # =====================================================================

    ratings = get_ratings(
        comment_text, hate_model, spam_model, tokenizer_hate, tokenizer_spam
    )
    print(ratings)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"[PipeLined] fallback triggered: {exc}", file=sys.stderr)
        print("(0.0, 0.0)")
        sys.exit(0)
