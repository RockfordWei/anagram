/*
 Anagram Solution Class in Java + Spark
 by Rockford Wei, March 15th, 2018
 */
package com.cologmag.anagram;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.SparkConf;
import java.util.Arrays;
import java.util.HashMap;
import org.apache.spark.api.java.JavaPairRDD;
import scala.Tuple2;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

/**
 * This is a demo class for a high performance anagram solution in Java + Spark
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
     * solve all the anagrams for a word
     * @param word a text to input
     * @return a string joined with comma as the solution
     */
    public String solve(String word) {
        HashMap<Byte, Integer> freq = Anagram.freqChar(word);
        String solution = 
            cache.filter( p -> p._1.equals(freq) && !p._2.equals(word))
                .map(p -> '"' + p._2 + '"')
                .reduce((String previous, String next) -> previous + ',' + next);
        return solution;
    }
    
    /**
     * HttpHandler
     * @param he required by the interface
     * @throws java.io.IOException
     */
    @Override
    @SuppressWarnings("ConvertToTryWithResources")
    public void handle(HttpExchange he) throws IOException {
        String param = he.getRequestURI().getQuery();
        String prefix = "anagram=";
        String response = "[]";
        if (param.startsWith(prefix)) {
            String word = param.substring(prefix.length()).toLowerCase();
            response = '{' + solve(word) + '}';
        }
        he.sendResponseHeaders(200, response.getBytes().length);
        OutputStream os = he.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
    
    public JavaPairRDD<HashMap<Byte, Integer>, String> cache;
    
    public Anagram(JavaRDD<String> hdfsTextFile) {
        cache = hdfsTextFile.flatMap(s -> Arrays.asList(s.split("\n")).iterator())
                .map(word -> word.toLowerCase())
                .mapToPair(word -> new Tuple2<>(Anagram.freqChar(word),  word));
        System.out.println(cache.count());
    }
    /**
     * @param args the command line arguments
     * @throws java.lang.Exception
     */
    public static void main(String[] args) throws Exception {
        SparkConf conf = new SparkConf().setAppName("anagram").setMaster("local[2]");
        JavaSparkContext sc = new JavaSparkContext(conf);
        JavaRDD<String> textFile = sc.textFile("hdfs://localhost:9000/input/20k.txt");
        Anagram a = new Anagram(textFile);
        System.out.println("dictionary ready");
        HttpServer webServer = HttpServer.create(new InetSocketAddress(8181), 0);
        webServer.createContext("/", a);
        webServer.setExecutor(null);
        System.out.println("server is running on 8181");
        System.out.println("you can test it as `curl http://localhost:8181/?anagram=eat`");
        webServer.start();
    }    
}