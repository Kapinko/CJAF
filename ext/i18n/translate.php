<?php
require_once('Ecl/Loader.php');
Ecl_Loader::registerAutoload();

define('GOOGLE_API_URL','https://www.googleapis.com/language/translate/v2');
define('GOOGLE_API_KEY','AIzaSyDv2ag1h8hSTMC8ZJDv7C5yLYEAf-figr0');

$opts = new Zend_Console_Getopt(
                array(
                    'source|s=s' => 'Source Language (defaults to english)',
                    'dest|d=s' => 'destination language',
                )
);
try {
    $opts->parse();
    if (!$opts->getOption('d')) {
        throw new Zend_Console_Getopt_Exception('Unknown Destination Language');
    }
} catch (Zend_Console_Getopt_Exception $e) {
    print<<< END
Usage:
     php translate.php [--source|-s <string>] --dest|d <string>

Valid Options:
     --source|-s <string>
          Source language (defaults to english)
     --dest|-d <string>
          Destination language

Examples:
     cat Base.js | php translate.php -l es > es-ES/Base.js
     php translate.php --lang ja < Base.js > ja-JP/Base.js

Languages:
af     Afrikaans           gl Galician       fa Persian
sq     Albanian            de German         pl Polish
ar     Arabic              el Greek          pt Portuguese
eu*    Basque              ht Haitian Creole ro Romanian
be     Belarusian          iw Hebrew         ru Russian
bg     Bulgarian           hi Hindi          sr Serbian
ca     Catalan             hu Hungarian      sk Slovak
zh-CN* Chinese Simplified  is Icelandic      sl Slovenian
zh-TW* Chinese Traditional id Indonesian     es Spanish
hr     Croatian            ga Irish          sw Swahili
cs     Czech               it Italian        sv Swedish
da     Danish              ja Japanese       th Thai
nl     Dutch               lv Latvian        tr Turkish
en     English             lt Lithuanian     uk Ukrainian
et     Estonian            mk Macedonian     vi Vietnamese
tl     Filipino            ms Malay          cy Welsh
fi     Finnish             mt Maltese        yi Yiddish
fr     French              no Norwegian

*Not currently supported as a language target via google translate API from
 English

END;
    exit();
}

$source_lang='en'; //source language abbreviation
$dest_lang=null; //destination language abbreviation

if ($opts->getOption('s')) {
    $source_lang = $opts->getOption('s');
}
$dest_lang=$opts->getOption('d');

//load the data from stdin
$source = file_get_contents("php://stdin");

//strip out any requiredefinitions (anything before the first { and after the last }
$json=null;
$matches=array();
$first_brace=strpos($source,'{');
$last_brace=strrpos($source,'}');
$json = substr($source,$first_brace,$last_brace-$first_brace+1);

$json = preg_replace('/\"\s*\+\s*\"/m','',$json);
$json_obj=json_decode($json);
//print_r($json_obj);
$translated_obj=recursive_translate($json_obj, $source_lang, $dest_lang);

print json_encode($translated_obj);


//build the translation tree
function recursive_translate(stdClass $obj, $source_lang, $dest_lang) {
    $response=new stdClass();
    foreach($obj as $key=>$value) {
        switch(gettype($value)) {
            case "string":
                $response->$key=google_translate((string) $value,$source_lang,$dest_lang);
                break;
            case "object":
                $response->$key=recursive_translate($value,$source_lang,$dest_lang);
                break;
        }
    }
    return $response;
}

function google_translate($phrase, $source_lang, $dest_lang) {
  if ($phrase=='') {
      return $phrase;
  }
  $url = GOOGLE_API_URL.'?key='.GOOGLE_API_KEY.'&q='.urlencode($phrase).
         '&source='.urlencode($source_lang).'&target='.urlencode($dest_lang).
         '&prettyprint=false';
  //print $url."\n";
  $result = file_get_contents($url);
  $response = json_decode($result);
  if ($response->data->translations) {
      $translations = $response->data->translations;
      return $translations[0]->translatedText;
  } else {
      throw new Exception("Could not translate '$phrase' from $source_lang to $dest_lang using $url");
  }
}