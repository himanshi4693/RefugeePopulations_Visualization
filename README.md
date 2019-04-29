# Refugee Populations across Europe - Visualization


## Getting started

The dependencies for the project can be installed using

    $ pip install -r requirements.txt

You can use ``Vagrant`` to start a machine with a MongoDB instance running

    $ vagrant up


 Importing the data

    $ mongoimport -d refugees -c projects --type csv --file /path/to/refugeedata_eu.csv -headerline
