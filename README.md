# Refugee Populations across Europe - Visualization

![sample](https://user-images.githubusercontent.com/38923623/56874648-a677e200-6a3b-11e9-9791-25670ef22150.gif)


## Getting started

The dependencies for the project can be installed using

    $ pip install -r requirements.txt

You can use ``Vagrant`` to start a machine with a MongoDB instance running

    $ vagrant up


 Importing the data

    $ mongoimport -d refugees -c projects --type csv --file /path/to/refugeedata_eu.csv -headerline
