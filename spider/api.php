<?php
require 'codeguy-Slim-3a2ac72/Slim/Slim.php';
\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim();

function __autoload($className){
    include_once "./entity/$className.php";
}
include_once 'config.php';
include_once 'handlers/dataAccess.php';
include_once 'entity/product.php';
include_once 'handlers/handlerProduct.php';


$app->get("/products", function()use ($app){
    $app->response->headers->set('Content-Type', 'application/json');
    $products = array();
  	 $da = new dataAccess();
    $products = $da->GetAllProduct();
	echo json_encode($products);
});

?>