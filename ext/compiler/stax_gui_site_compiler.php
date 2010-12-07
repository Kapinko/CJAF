<?php

require_once('Ecl/Loader.php');
Ecl_Loader::registerAutoload();

$opts = new Zend_Console_Getopt(
                array(
                    'libdir|l=s' => 'Library directory',
                    'basepath|b=s' => 'Basepath',
                    'mapping|m=s' => 'comma-separated directory mapping',
                    'input|i=s' => 'input html file(s)',
                    'included_file|n=s' => 'assume the given file is already included',
                    'collected|c=s' => 'file to write collectes js to',
                    'compressed|s=s' => 'file to write compressed js to',
                    'advanced|a' => 'enable advanced optimizations for closure',
                    'require|r=s' => 'path for requirejs',
                    'final|f=s' => 'write these files last',
                    'notidy' => "don't cleanup extra whitespace in templates",
                    'closure-path=s' => 'path to google closure jar',
                    'rhino-path=s' => 'path to mozilla rhino jar',
                    'help|h' => 'help message',
                )
);
try {
    $opts->parse();
    if (!$opts->getOption('c')) {
        throw new Zend_Console_Getopt_Exception();
    }
} catch (Zend_Console_Getopt_Exception $e) {
    print<<< END
Usage:
     php stax_gui_site_compiler.php [OPTIONS]

Valid Options
     --libdir|-l <string>  
                        Comma-separated list of library directories. Used to
                        identify files to be parsed. Example:
                        -l "lib,stax,sodexo"
     --basepath|-b <string>
                        base path to ensure is prepended to all loaded files.
                        Defaults to 'js/'
     --mapping|-m <string>
                        Rewrites a directory from logical to physical path.
                        Semicolon-separate multiple pairs. 
                        Example: -m 'jQuery/,lib/jquery/;jQueryUI,lib/jquery/ui'
     --input|-i <string>
     					Use the given file as an input HTML file to start
     					javascript spidering. Can be comma-separated for
     					multiple entries.
     					Example -i 'index.html,login.html'                                 
     --included_file|-n <string>
                        Assume the given files are already included in the
                        html and do not attempt to import them.
                        Example: -n '/js/lib/jquery-1.4.2-min,/js/lib/jquery-ui-1.8.4-min'
     --collected|-c <string>
                        File to write collected JS to (required)
     --compressed|-s <string>
     					File to write closure-compressed JS to (optional)
     --advanced|-a      Enable ADVANCED_OPTIMIZATIONS flag for closure compiler     					
     --require|-r <string>
     				    Javascript path for requirejs. Defaults to
     				    '/js/lib/allplugins-require'. Used to identify
     				    where to write strings in collected JS. 
     --final|-f <string>
     					Files specified here will be written LAST
     					in the collected JS. Sepcify multiple entries by
     					comma separation. Example: 
     					-f 'sodexo/card_holder/bootstrap/login'
     --notidy			disables removing extra whitespace from templates
                        (on by default)			     					
     --closure-path <string>
     					Path to google closure jar (compiler.jar)
     					Defaults to /virtualhosts/ccs.tools/www/compiler/compiler.jar
     --rhino-path <string>
     					Path to Mozilla Rhino jar (js.jar)
     					Defaults to /virtualhosts/ccs.tools/www/compiler/rhino.jar
     --help|-h          Display this message

Examples:
     php stax_gui_site_compiler.php -i index.html -c js/collected.js -s js/compressed.js 
     php stax_gui_site_compiler.php -i login.html -l "lib,stax,sodexo,jQuery,jQueryUI" \
       -b 'js/' -m 'jQuery/,lib/jquery/;jQueryUI,lib/jquery/ui;/js/,;i18n!,' \
       -n '/js/lib/jquery-1.4.2.min,/js/lib/jquery-ui-1.8.4.min' \
       -c 'js/login-collected.js' -s 'js/login-compresed.js' \
       -f 'stax/bootstrap/abstract,sodexo/card_holder/bootstrap/login'  

END;
    exit();
}

$output = $opts->getOption('collected');
$compressed = $opts->getOption('compressed');

$libdirs = array();
foreach (explode(',', $opts->getOption('libdir')) as $libdir) {
    $libdirs[] = $libdir . '/';
}

$mappings = array();
foreach (explode(';', $opts->getOption('mapping')) as $mapping) {
    list($k, $v) = explode(',', $mapping);
    $mappings[$k] = $v;
}

$base_path = './';
if ($opts->getOption('basepath')) {
    $base_path = $opts->getOption('basepath');
}

$included_files = array();
foreach (explode(',', $opts->getOption('included_file')) as $inclfile) {
    $included_files[$inclfile] = true;
}

$require_js = '/js/lib/allplugins-require';
if ($opts->getOption('require')) {
    $require_js = $opts->getOption('require');
}

$final_files = array();
if ($opts->getOption('final')) {
    $final_files = explode(',', $opts->getOption('final'));
}

$closure_path = '/virtualhosts/ccs.tools/www/compiler/compiler.jar';
if ($opts->getOption('closure-path')) {
    $closure_path = $opts->getOption('closure-path');
}

$rhino_path = '/virtualhosts/ccs.tools/www/compiler/rhino.jar';
if ($opts->getOption('rhino-path')) {
    $rhino_path = $opts->getOption('rhino-path');
}


$files_to_parse = array();
foreach (explode(',', $opts->getOption('input')) as $htmlfile) {
    $html = file_get_contents($htmlfile);
    $html_js = array();
    $application = array();
    preg_match_all("/[\"']([^\"']+)\.js[\"']/", $html, $html_js);
    preg_match("/stax.Appplication.start\([\"']([^\"']+)[\"']/", $html, $application);
    $files_to_parse[] = $application[1];
    foreach ($html_js[1] as $js) {
        if (!in_array($js, $files_to_parse)) {
            $files_to_parse[] = $js;
        }
    }
}

//$dependency_regex="/stax.define\([^\)]*[\"']((?:i18n!)*(?:".str_replace("/","\/",join("|",$libdirs)).")[^\"' ]+)[\"']/";
//$dependency_regex=  "/stax.define\([^\]]*[\"']((?:i18n!)*(?:".str_replace("/","\/",join("|",$libdirs)).")[^\"' ]+)[\"']/";
//$dependency_regex = "/stax.define\([^\]]*[\"']((?:i18n!)*(?:".str_replace("/","\/",join("|",$libdirs)).")[^\"' ]+)[\"']/";
$dependency_regex = "/stax.define\([^\[]+\[([^\]]+)/";
$dependency_regex_2 = "/['\"]([^'\"]+)['\"]/";

$included_regex = "/[^\:]{2}[\"']((?:i18n!)*(?:" . str_replace("/", "\/", join("|", $libdirs)) . ")[^\"' ]+)[\"']/";
$template_regex = "/[\"']((?:i18n!)*[^\"' ]+\.ejs)[\"']/";

$written_ejs = false;

$file_data = array();
print "$output\n";
while ($file = array_shift($files_to_parse)) {
    if ($included_files[$file] || $file . '.js' == "/" . $output || $file . '.js' == '/' . $compressed) {
        continue;
    }
//    print "working on $file\n";
    $included_files[$file] = true;

    $filename = $file;
    if (substr($file, 0, strlen($base_path)) == $base_path) {
        $filename = substr($file, strlen($base_path));
    }

    $filename = str_ireplace(array_keys($mappings), array_values($mappings), $filename);

    if (file_exists('./' . $base_path . $filename . ".js")) {
        $fn = './' . $base_path . $filename . ".js";
    } elseif (file_exists('./' . $base_path . $filename . ".ejs")) {
        $fn = './' . $base_path . $filename . ".ejs";
    } elseif (file_exists('./' . $file)) {
        $fn = "./" . $file;
    } elseif (file_exists('./' . $file . ".js")) {
        $fn = "./" . $file . ".js";
    } elseif (file_exists('.' . $base_path . $file . ".js")) {
        $fn = "." . $base_path . $file . ".js";
    } elseif (file_exists('./' . $base_path . $filename . ".js")) {
        $fn = './' . $base_path . $filename . ".js";
    } elseif (file_exists('./' . $base_path . $file . ".js")) {
        $fn = "./" . $base_path . $file . ".js";
    } else {
        print "WARNING: Can't load $filename ($file)\n";
        $file_data[$file]['name'] = $file;
        $file_data[$file]['dependencies'] = array();
        $file_data[$file]['contents'] = '';
        continue;
    }
//	print "loading $fn\n";
    $contents = file_get_contents($fn);

    $file_data[$file]['contents'] = $contents;
    $file_data[$file]['name'] = $file;
    $file_data[$file]['fs_name'] = $fn;
    $file_data[$file]['dependencies'] = array();

    if (substr($fn, -3, 3) == 'ejs') {
        $file_data[$file]['template'] = true;
    }

    $dependencies = array();
    preg_match($dependency_regex, $contents, $dependencies);
    preg_match_all($dependency_regex_2, $dependencies[1], $dependencies);

    $requested_files = array();
    preg_match_all($included_regex, $contents, $requested_files);

    $templates = array();
    preg_match_all($template_regex, $contents, $templates);

    foreach ($dependencies[1] as $match) {
        if (!is_array($file_data[$match])) {
            $file_data[$match] = array('dependencies' => array());
        }
        if ($match == $file) {
            continue;
        }

        $file_data[$file]['dependencies'][] = $match;
//        print "adding $match to parse as a dependency for $fn\n";

        if (!in_array($match, $files_to_parse)) {
            $files_to_parse[] = $match;
        }
    }

    foreach ($requested_files[1] as $match) {
        if ($match == $file || $included_files[$match]) {
            continue;
        }

        if ($included_files[$match]) {
            continue;
        }
        if (!in_array($match, $files_to_parse)) {
            $files_to_parse[] = $match;
//            print "adding $match to parse as a requested file for $fn\n";
        }
    }

    foreach ($templates[1] as $match) {
        if ($match == $file || $included_files[$match]) {
            continue;
        }
        $file_data[$file]['dependencies'][] = $match;
        if ($included_files[$match]) {
            continue;
        }

        if (!in_array($match, $files_to_parse)) {
            $files_to_parse[] = $match;
//            print "adding $match to parse as a template for $fn\n";
        }
    }
}

//print_r($file_data);
//exit;
/*
  foreach($file_data as $fn) {
  //print_r($fn);
  print $fn['name'].": \n";
  foreach($fn['dependencies'] as $dep) {
  print " - $dep\n";
  }
  }
 */

$tree_depth = 200;
$unwritten_files = true;
$ofh = fopen($output, "w");
$written_templates = false;
$written_files = array();
foreach ($final_files as $file) {
    $written_files[$file] = true;
}
while ($iterations++ < $tree_depth && $unwritten_files) {
    $unwritten_files = false;
    foreach ($file_data as $file) {
        if ($file['template']) {
            //we write ejs templates only after requirejs
            $written_files[$file['name']] = true;
            continue;
        }
        $dependencies_met = true;
        foreach ($file['dependencies'] as $dep) {
            if (!$written_files[$dep]) {
                //print "dep $dep unmet for {$file['name']}\n";
                $dependencies_met = false;
                $unwritten_files = true;
                //dependencies for this file have not been met
                break;
            }
        }
        if ($dependencies_met && !$written_files[$file['name']]) {
            if ($file['contents']) {
//                print "writing {$file['name']}\n";
            } else {
                print "skipping {$file['name']}\n";
            }
            fwrite($ofh, "\n/* {$file['name']} */\n");
            if (substr($file['name'], -3, 3) == 'ejs') {
                if (!$written_ejs) {
                    fwrite($ofh, "$['sTc']={};\n");
                    $written_ejs = true;
                }
                fwrite($ofh, parse_contents_for_javascript($file['contents'], $file['name'], !$opts->getOption('notidy')) . "\n");
            } else {
                fwrite($ofh, $file['contents'] . "\n");
            }
            //print $file['contents'];
            $written_files[$file['name']] = true;
            if ($file['name'] == $require_js) {
                write_requireJs_definitions($ofh, $file_data);
                if (!$written_templates) {
                    write_ejs_templates($ofh, $file_data);
                    $written_templates = true;
                }
            }
        }
    }
}

foreach ($final_files as $file) {
    fwrite($ofh, "\n/* {$file} */\n");
    //print "writing {$file}\n";
    if (substr($file, -3, 3) == 'ejs') {
        //done earlier
        //fwrite($ofh,parse_contents_for_javascript($file_data[$file]['contents'],$file)."\n");
    } else {
        fwrite($ofh, $file_data[$file]['contents'] . "\n");
    }
}

if ($iterations >= $tree_depth) {
    print "ERROR - tree depth exceeded. Possible recursive dependency.\n Unmet file dependencies:\n";
    foreach ($included_files as $file => $included) {
        if (!$written_files[$file]) {
            print "{$file}\n";
            $fd = $file_data[$file];
            unset($fd['contents']);
            print_r($fd);
            foreach ($file_data[$file]['dependencies'] as $dep) {
                if (!$written_files[$dep]) {
                    print " $file -- $dep not provided\n";
                }
            }
        }
    }
    exit(1);
}

//all done! time to run closure
if ($opts->getOption('compressed')) {
    $advanced_opts = '';
    if ($opts->getOption('advanced')) {
        $advanced_opts = " --compilation_level ADVANCED_OPTIMIZATIONS";
    }
    shell_exec('java -jar ' . $closure_path . ' --js ' . $output .
            ' --js_output_file ' . $opts->getOption('compressed') . $advanced_opts);
}

//all done!
exit;

function write_ejs_templates($fh, $file_data) {
    print "writing out ejs templates\n";
    fwrite($fh, "$['sTc']={};\n");
    foreach ($file_data as $file) {
        if (!$file['template']) {
            continue;
        }
//        print "writing {$file['name']}\n";
        fwrite($fh, parse_contents_for_javascript($file['contents'], $file['name']) . "\n");
    }
}

function write_requireJs_definitions($fh, $file_data) {
    //write out loaded data for requireJs
    print "writing out requirejs definitions\n";
    fwrite($fh, "require({baseUrl:'/js/',paths:{'stax': 'stax',
                'lib': 'lib',
                'jQuery': 'lib/jquery',
                'jQueryUI': 'lib/jquery/ui'},waitSeconds:0.001});
	$['sOc']={};\n");
    foreach ($file_data as $file) {
        if ($file['fs_name']) {
            //print normalize_path($file['fs_name'],$base_path)."\n";
            fwrite($fh, "$['sOc']['" . normalize_path($file['fs_name'], null) . "']=true;\n");
        } else {
            //we never could load the file.. don't tell requireJS we did
        }
    }
    $require_override = <<< EOF
var requireJsLoad = require.load;
require.load = function(moduleName, contextName){
	if($['sOc'][require.nameToUrl(moduleName, null, contextName)]) {
		//already loaded
		return; 
	} else {
	//if not in cache
	requireJsLoad.apply(requireJsLoad, arguments);
	}
}

EOF;
//fwrite($fh,$require_override);
}

function normalize_path($path, $base_path) {
    $path = str_replace('//', '/', $path);
    if (substr($path, 0, 1) == '.') {
        $path = substr($path, 1);
    }
    //print_r($path);
    return $path;
}

function parse_contents_for_javascript($contents, $filename, $tidy=false) {
    global $rhino_path;
    if (true) {
        /* $fn = tempnam(sys_get_temp_dir(),'tidy');
          file_put_contents($fn,$js_base);
          $contents = `tidy -q $fn`;
          unlink($fn);
         */
        $contents = preg_replace('/\s\s+/', ' ', $contents);
    }

    $js_base = 'var t = unescape("' . rawurlencode(trim($contents)) . '");';

    $js_base.=<<<'EOJS'
var getRenderingJsFromString = function(str)
{
    var blah =
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join(";p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');";
    return blah;
}
print(getRenderingJsFromString(t));
EOJS;

    $fn = tempnam(sys_get_temp_dir(), 'parse');
    file_put_contents($fn, $js_base);
//print 'java -classpath '.$rhino_path.' org.mozilla.javascript.tools.shell.Main '.$fn."\n";
    $result = shell_exec('java -classpath ' . $rhino_path . ' org.mozilla.javascript.tools.shell.Main ' . $fn);
    unlink($fn);

    return '$["sTc"]["' . $filename . '"]=new Function("obj",\'' . addcslashes(trim($result), "'") . '\');';
}