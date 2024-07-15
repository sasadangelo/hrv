# Salvatore D'Angelo Welness Website

This project is a website where I track all my training, weight loss, sleep and everything related to my health.

## Download the project

Run the following commands:

```
git clone https://github.com/sasadangelo/hrv
cd hrv
```

## Create the Python virtual environment

Run the following commands:

```
python3 -m venv venv
pip3 install -f requirements.txt
```

## Update manually the statistics

All the statistics are downloaded automatically, every day,from my Garmin watch. However, to run them manually run the following commands:

```
python3 update.py
```
