from anagram import Anagram
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
import urlparse
import urllib2
import json

response = urllib2.urlopen('https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt')
wordlist = response.read()
global_anagram = Anagram(wordlist)

class WebServer(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/json')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        if self.path.startswith('/?anagram='):
            components = self.path.split('=')
            if len(components) > 1:
                word = components[1]
                solution = global_anagram.solve(word)
                text = json.dumps(solution)
                self.wfile.write(text)
                del text
                del solution
            del components

    def do_HEAD(self):
        self._set_headers()
                
def run(server_class=HTTPServer, handler_class=WebServer, port=8181):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Starting Anagram Web Server on 8181  ...'
    httpd.serve_forever()

run()