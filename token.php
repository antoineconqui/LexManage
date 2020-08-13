<?php 

if(!isset($_GET['code'])){
    header('Location: https://ca1.contractexpress.com/IdServ/core/connect/authorize?client_id=antoine&redirect_uri=https://lexstart.ca/lexmanage/token.php&scope=CEAPI&response_type=code');
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
      CURLOPT_POSTFIELDS => "grant_type=authorization_code&redirect_uri=https%3A//lexstart.ca/lexmanage/token.php&code=".$code,
      CURLOPT_HTTPHEADER => array(
        "Authorization: Basic YW50b2luZTo2OWJhZmQ2ZS1mZTVhLTQ2YjYtYWJjMS0zZDA1Y2E4NWU3Njc="
      ),
    ));
    
    setcookie("token", json_decode(curl_exec($curl))->{'access_token'}, time()+1800);
    curl_close($curl);
    header('Location: http://lexstart.ca/lexmanage/');

}

?> 