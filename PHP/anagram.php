<?php

/*
Anagram Solution Class in PHP
by Rockford Wei, March 7th, 2018
*/

/**
* This is a demo class for a high performance anagram solution in JavaScript
* @author Rockford Wei
*/	
class Anagram {
	/**
	* convert a string to a frequency table
	* for example, if input is "weed", then the result should be
	* ["d": 1, "e": 2, "w": 1]
	* @param word a text string to input
	* @return a HashMap indexed by the alphabetic ASCII with value of its frequency
	*/
	public static function freqChar($word) {
		$freq = array();
		$chars = str_split($word);
		foreach ($chars as $ch) {
			if (array_key_exists($ch,	$freq)) {
				$freq[$ch] += 1;
			} else {
				$freq[$ch] = 1;
			}
		}
		return $freq;
	}
	/**
	* calculate the "weight" of a string, for faster comparison purpose
	* a "weight" is the ascii code sum of the input string
	* @param word the word input to calculate with
	* @return sum of the input word's ascii codes
	*/
	public static function weight($word) {
		$sum = 0;
		$chars = str_split($word);
		foreach ($chars as $ch) {
			$sum += ord($ch);
		}
		return $sum;
	}
	
	/**
	* solve all the anagrams for a word
	* @param word a text to input
	* @return a set of string as the solution
	*/
	public function solve($word) {
		$result = array();
		$w = strtolower($word);
		$size = strlen($w);
		$weight = Anagram::weight($w);
		$freq = Anagram::freqChar($w);
		if (array_key_exists($size, $this->storage)) {
			$same_size = $this->storage[$size];
			if (array_key_exists($weight, $same_size)) {
				$same_weight = $same_size[$weight];
				foreach ($same_weight as $u) {
					if ($u == $w) continue;
					$v = Anagram::freqChar($u);
					if ($freq == $v) {
						array_push($result, $u);
					}
				}
			}
		}
		return $result;
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
	public function append($word) {
		$w = strtolower($word);
		$size = strlen($w);
		$weight = Anagram::weight($w);
		if (array_key_exists($size, $this->storage)) {
			$same_size = $this->storage[$size];
			if (array_key_exists($weight, $same_size)) {
				$same_weight = $same_size[$weight];
				array_push($same_weight, $w);
				$same_size[$weight] = $same_weight;
			} else {
				$same_size[$weight] = array($w);
			}
			$this->storage[$size] = $same_size;
		} else {
			$same_size = array();
			$same_size[$weight] = array($w);
			$this->storage[$size] = $same_size;
		}
	}
	
	public function __construct($wordlist) {
		$this->storage = array();
		foreach ($wordlist as $word) {
			$this->append($word);
		}
	}
	
	public static function getInstance() {
		static $instance = null;
		if (is_null($instance)) {
			$url = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt";
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);  
			curl_setopt($ch, CURLOPT_HEADER, 0);  
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
			$text = curl_exec($ch);
			curl_close($ch);
			$wordlist = explode("\n", $text);
			$instance = new self($wordlist);
		}
		return $instance;
	}
}
?>
