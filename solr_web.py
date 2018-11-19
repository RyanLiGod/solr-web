#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
from flask import Flask, make_response, request

app = Flask(__name__)


@app.route('/search')
def search():
    key = request.args.get('key')
    result = requests.get('http://192.168.43.97:8983/solr/paper/select?q=%s&wt=json&indent=true' % key)
    rst = make_response(result.text)
    rst.headers['Access-Control-Allow-Origin'] = '*'
    return rst


@app.route('/suggest')
def suggest():
    key = request.args.get('key')
    result = requests.get('http://192.168.43.97:8983/solr/namewords/suggest?q=%s&wt=json&indent=true' % key)
    rst = make_response(result.text)
    rst.headers['Access-Control-Allow-Origin'] = '*'
    return rst


if __name__ == '__main__':
    app.run(host="localhost", port=4000)
