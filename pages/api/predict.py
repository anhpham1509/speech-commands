import sys
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
import numpy as np
from python_speech_features import mfcc
from scipy.io import wavfile
import scipy.signal as sig
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

labels = np.array(['yes', 'no', 'up', 'down', 'left', 'right', 'on', 'off', 'stop', 'go', 'unknown'])

def pad_samples(sig, num_samples):
    return np.pad(sig, pad_width=(num_samples - len(sig), 0), mode='constant', constant_values=(0, 0))


def cut_samples(sig, num_samples):
    beg = np.random.randint(0, len(sig) - num_samples)
    return sig[beg: beg + num_samples]


def get_mfcc_features(file, num_samples):
    Fs, in_sig = wavfile.read(file)
    Fs_target = 16000

    # print(Fs)

    if Fs != Fs_target:
        in_sig = sig.resample_poly(in_sig, Fs_target, Fs)
        Fs = Fs_target

    if len(in_sig) > num_samples:
        in_sig = cut_samples(in_sig, num_samples)
    else:
        if len(in_sig) < num_samples:
            in_sig = pad_samples(in_sig, num_samples)
    feat = StandardScaler().fit_transform(mfcc(in_sig))
    return feat

model_file = sys.argv[2]
input_file = sys.argv[2]

#read the audio file and extract MFCC features
NUM_SAMPLES = 16000
x = get_mfcc_features(input_file, NUM_SAMPLES)

#modify the feature shape
x_mod = np.array([x])

#load model
model = tf.keras.models.load_model(model_file)

#predict
y = model.predict(x_mod)

#get output label
y_max_idx = np.argmax(y, axis=1)
output_label = labels[y_max_idx][0]
print("{} {:.2f}%".format(output_label, y[0][y_max_idx][0] * 100))