<?php
require_once('Ecl/Loader.php');
Ecl_Loader::registerAutoload();

$opts = new Zend_Console_Getopt(
		array(
			'basepath|b=s'=>'Basepath',
		    'input|i=s'=>'input css file(s)',
		    'collected|c=s'=>'output path of collected css',
		    'compressed|s=s'=>'output path of compressed css',
		    'yui-path=s'=>'path to yui jar',
		    'noimport|n'=>"Don't follow import lines",
		    'help|h'=>'help message',
		)
);
try {
	$opts->parse();
	if (!$opts->getOption('i') || (!$opts->getOption('c')&& !$opts->getOption('s'))|| $opts->getOption('h')) {
		print_r($opts);
		throw new Zend_Console_Getopt_Exception('');
	}
} catch (Zend_Console_Getopt_Exception $e) {
	print_r($e);
	print<<< END
Usage:
     php css_compiler.php -i <file> -c <outfile> [OPTIONS]

Valid Options
     --basepath|-b <string>
                        base path to ensure is prepended to all loaded files.
                        Defaults to './'
     --input|-i <string>
                        Use the given file as an input CSS file to start
                        css spidering. Can be comma-separated for
                        multiple entries.
                        Example -i 'foo.css,bar.css'
     --collected|-c <string> 
                        File to write collected css to
     --compressed|-s <string>
                        File to write compressed css to
     --noimport|-n      Don't follow import definitions
     --yui-path <string>
                        Path to YUI compiler jar (compiler.jar)
                        Defaults to /virtualhosts/ccs.tools/www/compiler/yuicompressor.jar
     --help|-h          Display this message

Examples:
     php css_compiler.php -i base.css -o base-compressed.css --basepath 'www/' 
     php css_compiler.php -i base.css,override.css -o 

END;
	exit();
}
$base_path='./';
if ($opts->getOption('basepath')) {
	$base_path=$opts->getOption('basepath');
}
$outfile_collected=tempnam(sys_get_temp_dir(),'collected');
if ($opts->getOption('collected')) {
	$outfile_collected=$opts->getOption('collected');
}
$outfile_compressed=null;
if ($opts->getOption('compressed')) {
	$outfile_compressed=$opts->getOption('compressed');
}

$included_files=array();
foreach(explode(',',$opts->getOption('input')) as $inclfile){	
	$included_files[]=$inclfile;
} 

$yui_path='/virtualhosts/ccs.tools/www/compiler/yuicompressor.jar';
if ($opts->getOption('yui-path')) {
	$yui_path=$opts->getOption('yui-path');
}
define('IMPORT_REGEX','/(@import ["\']([^"\']+)["\'];)/');

$css_data_collected='';
foreach($included_files as $if) {
	$css_data_collected .= parse_file($if,!$opts->getOption('noimport'));
}

file_put_contents($outfile_collected,$css_data_collected);
unset($css_data_collected);

//run YUI compressor if necessary
if ($outfile_compressed) {
//	print 'java -jar '.$yui_path.' --type css -o '.$outfile_compressed.' '.$outfile_collected;
	shell_exec('java -jar '.$yui_path.' --type css -o '.$outfile_compressed.' '.$outfile_collected);
}

if (!$opts->getOption('collected')) {
	unlink($outfile_collected);
}

exit;


function parse_file($filename,$follow_import=true) {
	global $base_path;
	$filepath = $base_path.$filename;
	if (!file_exists($filepath)) {
		throw new Exception("Could not load $filepath");
	}
	$file_path = substr($filename,0,strrpos($filename,'/')+1);
	
	$file_contents = "/* start of $filename */\n";
	$file_contents.= file_get_contents($filepath);
	
	//prepend any URLs with the file path if they don't start with a slash or http
	$urls = array();
	$replaced_urls=array();
	preg_match_all('/url\(([^\)]+)\)/',$file_contents,$urls);
	foreach($urls[1] as $url) {
		switch(substr($url,0,1)) {
			case "'":
			 $quote = "'";
			 $url=substr($url,1,-1);
			 break;
			case '"':
			 $quote = '"';
			 $url=substr($url,1,-1);
			 break;
			default:
			 $quote="";
		}
		
		if (strtolower(substr($url,0,4)) == 'http') {
			continue;
		}
		if (substr($url,0,1) == '/') {
			continue;
		}
		if (isset($replaced_urls[$url])) {
			continue;
		}
		$replaced_urls[$url]=true;
		$file_contents = str_replace($url, $quote.$file_path.$url.$quote, $file_contents);		
	}
	
	if ($follow_import) {
		//replace any @import clauses with their contents
		$imports=array();
		preg_match_all(IMPORT_REGEX,$file_contents,$imports);		
		/* $imports[0] and [1] will be the full import line.
		 * $imports[2] will be just the file path           */ 		
		for($i=0; $i<count($imports[0]); $i++) {
			$css_path=$imports[2][$i];
			$contents = "/* beginning import $css_path */\n".parse_file($css_path)."/* end of $css_path import */\n/* resuming $filename */\n";
			$file_contents = str_replace($imports[0][$i], $contents, $file_contents);		
		}
	}
	return $file_contents;	
}