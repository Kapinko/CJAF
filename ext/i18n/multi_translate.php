<?php
require_once('Ecl/Loader.php');
Ecl_Loader::registerAutoload();

$filename=$argv[1];
$source=file_get_contents($filename);
$transname=basename($filename);
if (!$source) {
    print<<< END
Usage:
     php multi_translate.php <filename>

Examples:
     php multi_translate.php Base.js

END;
    exit();
}

//strip out any require definitions (anything before the first { and after the last })
$json=null;
$matches=array();
$first_brace=strpos($source,'{');
$last_brace=strrpos($source,'}');
$json = substr($source,$first_brace,$last_brace-$first_brace+1);
$json = preg_replace('/\"\s*\+\s*\"/m','',$json);
$json = preg_replace('/[\t\n]/',' ',$json);

$json_obj=json_decode($json);
$require_header=substr($source,0,$first_brace);

$mt_path = dirname($argv[0]);

foreach($json_obj as $lang=>$val) {
    if(gettype($val) == 'boolean' && $val) {
        print "processing $lang\n";
        $lang=substr($lang,0,2);
        mkdir($lang);
        $cmd = 'php '.$mt_path.DIRECTORY_SEPARATOR.'translate.php';
        $cmd.= ' --dest '.$lang;
        $descriptorspec = array(
           0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
           1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
        );

        $process = proc_open($cmd, $descriptorspec, $pipes, $cwd, $env);

        if (is_resource($process)) {
        fwrite($pipes[0], $source);
        fclose($pipes[0]);

        $translation=stream_get_contents($pipes[1]);
        fclose($pipes[1]);
        $return_value = proc_close($process);
        } else {
            throw new Exception("Could not start PHP process");
        }

        $translated_header = str_replace('nls',$lang,$require_header);
        $translated_footer=');';

        file_put_contents($lang.DIRECTORY_SEPARATOR.$transname,
                  $translated_header.$translation.$translated_footer);
    }
}