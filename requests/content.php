<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://ca1.contractexpress.com/Rest/api/contracts/".$_POST['id']."/documents"."/".$_POST['document']."/content",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Authorization: Bearer ".$_POST['token']
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

 ?>