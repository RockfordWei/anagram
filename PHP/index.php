<?php
include 'anagram.php';

if (isset($_GET['anagram'])) {
	$word = $_GET['anagram'];
	$anagram = Anagram::getInstance();
	$result = $anagram->solve($word);
	echo json_encode($result);
} else {
	echo '[]';
}
?>
