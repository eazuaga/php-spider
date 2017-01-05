<?php

include_once 'simple_html_dom.php';


include_once 'api.php';

//$img="http://www.rosariogarage.com/resources_production/principal/uploads_files/2015/07/04/1424022/imagen-con-10-177.jpg";
//echo "<img src=".$img." >";

function getHtml(){
    $html = file_get_html('http://www.rosariogarage.com/Autos');
    return $html;
}




/*autos premium ANDA*/

function SavePremiuns($html){
    $url ="http://www.rosariogarage.com/";
$ret = $html->find('.box_aviso_premium');


foreach($ret as $item){
    //imagen;
    
    $item2 = $item->children[0]->children;
    $img = $item2[0]->children[0]->attr['rel'];
    $fullImage =  $url.$img;
   
   //echo '<img src="'. $url.$img.'"> ';
    //aviso
    $title =$item->children[1]->children[0]->children[0]->plaintext;
    $precio =$item->children[1]->children[1]->plaintext;
    $descript =$item->children[1]->children[2]->children[1]->plaintext;
   // $total =$item->children[1]->plaintext;
    
    $product = new product();
    $product->title = $title;
    $product->description = $descript;
    $product->price = $precio;
    $product->img = $fullImage;
    $product->special = 1;
    $product->idcategory = 1;
    $product->internalId = 1;
    
    $data =new dataAccess();
    $data->saveProduct($product);
}
}




/*autos comunes*/

function saveCurrentsProducts($html){
    $url ="http://www.rosariogarage.com/";
    $ret = $html->find('.j_box_aviso');
    foreach($ret as $item){
        //imagen;
        
        $item2 = $item->children[1]->children;
        $img = $item2[0]->children[0]->attr['rel'];
        $fullImage =  $url.$img;
        
        //echo '<img src="'. $url.$img.'"> ';
        //aviso
        //$test = $item->find('.j_titulo_aviso')->plaintext;
        
        //$title =$item->children[1]->children[0]->children[0]->plaintext;
        
        //   $descript =$item->children[1]->children[2]->children[1]->plaintext;
        $title =$item->children[2]->plaintext;
        $descript =$item->children[3]->plaintext;
        $precio =$item->children[4]->plaintext;
        
        $product = new product();
        $product->title = $title;
        $product->description = $descript;
        $product->price = $precio;
        $product->img = $fullImage;
        $product->special = 0;
        $product->idcategory = 1;
        $product->internalId = 1;
        
        $data =new dataAccess();
        $data->saveProduct($product);
        //    echo ' Titulo: '.$title. ' bajada:  '.$total. ' precio :'.$precio ;
        
    }
}






//echo $item->children[0]->children[0]->attr[0] ;
// Find all images 
//echo json_encode($ret);
//foreach($ret as $item){
//    echo $item->children(0)->children(0)->attr(3) ;
//}


//foreach($html->find('img') as $element) 
//    echo $element->src . '<br>';

SavePremiuns(getHtml());
$app->run();
?>
