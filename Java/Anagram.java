/*
 Anagram Solution Class in Java
 by Rockford Wei, March 6th, 2018
 */
package anagram;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.HashSet;

/**
 * This is a demo class for a high performance anagram solution in Swift
 * @author Rockford Wei
 */
public class Anagram implements HttpHandler {

    /**
     * convert a string to a frequency table
     * for example, if input is "weed", then the result should be
     * ["d": 1, "e": 2, "w": 1]
     * @param word a text string to input
     * @return a HashMap indexed by the alphabetic ASCII with value of its frequency
     */
    public static HashMap<Byte, Integer> freqChar(String word) {
        byte[] bytes = word.getBytes();
        HashMap<Byte, Integer> f = new HashMap();
        for(byte ch: bytes) {
            Byte b = (Byte)ch;
            if (f.containsKey(b)) {
                Integer i = f.get(b);
                f.put(b, i+1);
            } else {
                f.put(b, 1);
            }
        }
        return f;
    }
    
    /**
     * calculate the "weight" of a string, for faster comparison purpose
     * a "weight" is the ASCII code sum of the input string
     * @param word the word input to calculate with
     * @return sum of the input word's ASCII codes
     */
    public static int weight(String word) {
        byte[] bytes = word.getBytes();
        int sum = 0;
        for(byte ch: bytes) {
            sum += (int)ch;
        }
        return sum;
    }
    /**
     * an indexed word groups for the anagram solution, see [build()](#build)
     */ 
    private final HashMap<Integer, HashMap<Integer, HashSet<String>>> 
            storage;

    public Anagram() {
        this.storage = new HashMap();
    }
        
    /** 
     * append a word to the indexed storage
     * this is the key to speed up an anagram puzzle solution.
     * all words are grouped by size and weight,
     * for example, "dog" and "cow" both belong to a group of size 3,
     * but "horse" belongs to a group of size 5.
     * in each group, all words are again categorized by weight.
     * for example, "dog" is in group 3 and in weight list of
     * sum = "d" + "o" + "g" (ASCII code)
     * and "horse" is in group 5 but also in a weight list of
     * sum = "h" + "o" + "r" + "s" + "e"
     * @param word the word to append
     */
    public void append(String word) {
        String w = word.toLowerCase();
        int size = word.length();
        int weight = weight(w);
        if (storage.containsKey(size)) {
            HashMap<Integer, HashSet<String>> sameSized = storage.get(size);
            if (sameSized.containsKey(weight)) {
                HashSet<String> sameWeight = sameSized.get(weight);
                sameWeight.add(w);
                sameSized.put(weight, sameWeight);
            } else {
                HashSet<String> sameWeight = new HashSet();
                sameWeight.add(w);
                sameSized.put(weight, sameWeight);
            }
            storage.put(size, sameSized);
        } else {
            HashSet<String> sameWeight = new HashSet();
            sameWeight.add(w);
            HashMap<Integer, HashSet<String>> sameSized = new HashMap();
            sameSized.put(weight, sameWeight);
            storage.put(size, sameSized);
        }
    } 
    
    /**
     * solve all the anagrams for a word
     * @param word a text to input
     * @return a set of string as the solution
     */
    public HashSet<String> solve(String word) {
        HashSet<String> result = new HashSet();
        String w = word.toLowerCase();
        int size = word.length();
        int weight = weight(w);
        if (storage.containsKey(size)) {
            HashMap<Integer, HashSet<String>> sameSized = storage.get(size);
            if (sameSized.containsKey(weight)) {
                HashSet<String> sameWeight = sameSized.get(weight);
                HashMap<Byte, Integer> target = Anagram.freqChar(w);
                sameWeight.forEach((candidate) -> {
                    if (!candidate.equals(w)) {
                        HashMap <Byte, Integer> f = Anagram.freqChar(candidate);
                        if (f.equals(target)) {
                            result.add(candidate);
                        }
                    }
                });
            }
        }
        return result;
    }
    
    @Override
    public void handle(HttpExchange he) throws IOException {
        String param = he.getRequestURI().getQuery();
        String prefix = "anagram=";
        String response = "[]";
        if (param.startsWith(prefix)) {
            String word = param.substring(prefix.length());
            HashSet<String> solution = solve(word);
            response = solution.toString();
        }
        he.sendResponseHeaders(200, response.getBytes().length);
        OutputStream os = he.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
    
    /**
     * @param args the command line arguments
     * @throws java.lang.Exception
     */
    public static void main(String[] args) throws Exception {
        URL wordlist = new URL("https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt");
        URLConnection cnn = wordlist.openConnection();
        BufferedReader in = new BufferedReader(new InputStreamReader(cnn.getInputStream()));
        Anagram a = new Anagram();
        String line; 
        while((line = in.readLine()) != null) {
            a.append(line);
        }
        HttpServer webServer = HttpServer.create(new InetSocketAddress(8181), 0);
        webServer.createContext("/", a);
        webServer.setExecutor(null);
        webServer.start();
    }    
}
