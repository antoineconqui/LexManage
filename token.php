<?php 

if(!isset($_GET['code'])){
    echo 'test';
    header('Location: https://ca1.contractexpress.com/IdServ/core/connect/authorize?client_id=antoine&redirect_uri=http://localhost/lexmanage/token.php&scope=CEAPI&response_type=code');
}
else{
    $code = $_GET['code'];
    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://ca1.contractexpress.com/IdServ/core/connect/token",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => "grant_type=authorization_code&redirect_uri=http://localhost/lexmanage/token.php&code=".$code,
      CURLOPT_HTTPHEADER => array(
        "Authorization: Basic YW50b2luZTpkZGJhNmExZS03ODY1LTQ0N2YtOTdjNi1iZGQzYTA4MzIxYWY="
      ),
    ));
    // lexmanage
    // 2a46494c-3aeb-4a3c-b076-1eccbff69e9b
    
    setcookie("token", json_decode(curl_exec($curl))->{'access_token'}, time()+1800);
    curl_close($curl);
    header('Location: http://localhost/lexmanage/');

}

?> 