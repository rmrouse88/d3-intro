import requests
import csv

def get_iris():

    r = requests.get('https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/d546eaee765268bf2f487608c537c05e22e4b221/iris.csv')
    data = r.text
    iris = {'iris': []}
    for line in csv.DictReader(data.splitlines(), skipinitialspace = True):
        iris['iris'].append(dict(
            sepal_length = line['sepal_length'],
            sepal_width = line['sepal_width'],
            petal_length = line['petal_length'],
            petal_width = line['petal_width'],
            species = line['species']
            )
        )

    return iris

