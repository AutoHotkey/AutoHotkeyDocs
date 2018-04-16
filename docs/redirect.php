<?php

$topic = $_REQUEST['topic'];
if (!isset($topic))
{
	redirect_to_docs();
}

//
// Load the index
//
$index = file_get_contents('./static/source/data_index.js');
if ($index === false)
{
	fail_exit();
}
$index = json_decode(rtrim(substr($index, strpos($index, '[')), "; \r\n"));
if (!isset($index))
{
	fail_exit();
}

redirect_to_topic_if_found($topic);

// Topic not found, so see if it looks like a bad URL.
if (substr($topic, -4) == '.htm')
{
	// Handle commands/RunWait.htm like redirect.php?topic=RunWait
	if (substr($topic, 0, 9) == 'commands/')
		$topic = substr($topic, 9);
	$topic = substr($topic, 0, -4);
	redirect_to_topic_if_found($topic);
}

// Topic not found, so search instead.
redirect_to('https://www.google.com/search?q=site:autohotkey.com/docs/%20'
			. urlencode($topic), 302);

function redirect_to_topic_if_found($topic)
{
	global $index;
	foreach ($index as $item)
	{
		$pos = stripos($item[0], $topic);
		if ($pos !== false) // Substring match.
		{
			if (strlen($item[0]) == strlen($topic)) // Full match.
			{
				$best_match = $item;
				break;
			}
			if (!isset($best_match) || ($pos == 0 && $best_pos != 0))
			{
				$best_match = $item;
				$best_pos = $pos;
			}
		}
	}
	if (isset($best_match))
	{
		redirect_to_docs($best_match[1]);
	}
}

function redirect_to_docs($where = '')
{
	redirect_to('https://autohotkey.com/docs/' . $where);
}

function redirect_to($where, $status = 301)
{
	header('Location: ' . $where, true, $status);
	exit();
}

function fail_exit()
{
	echo 'Sorry, an error occurred. Please let us know via <a href="https://autohotkey.com/boards/viewforum.php?f=3">the forums</a>.';
	exit();
}
