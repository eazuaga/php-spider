<?php

/**
 * product short summary.
 *
 * product description.
 *
 * @version 1.0
 * @author eduardo.azuaga
 */
class handlerProduct
{
    private $pdo;
    public function __construct($pdo){
        $this->pdo = $pdo;
    }
    public function create() {
        return   "INSERT INTO product (internalId, idcategory,title,description,price,special,img)
                              VALUES (:internalId ,:idcategory,:title, :description ,:price , :special , :img );";
    }
    public function save($params){
       
            $stm = $this->pdo->prepare($this->create());
            $stm->bindParam(':internalId', $params->internalId);
            $stm->bindParam(':idcategory', $params->idcategory);
            $stm->bindParam(':title', $params->title);
            $stm->bindParam(':description', $params->description);
            $stm->bindParam(':price', $params->price);
            $stm->bindParam(':special', $params->special);
            $stm->bindParam(':img', $params->img);
            return $stm->execute();
       
    }
    public function getAll() {
        $sql = " SELECT * FROM rg.product;";
        $stm = $this->pdo->prepare($sql);
        $arr = array();
        $stm->execute();
        foreach ($stm->fetchAll() as $result) {
		    $object = $this->mapFromRow($result);
		    $arr[] = $object;
		}
		return $arr;
    }
    private function mapFromRow($result){
        $object = new product();
        $object->internalId = $this::read_value($result, 'internalId');
        $object->idcategory = $this::read_value($result, 'idcategory');
        $object->title = $this::read_value($result, 'title');
        $object->description = $this::read_value($result, 'description');
        $object->price = $this::read_value($result, 'price');
        $object->special = $this::read_value($result, 'special');
        $object->img = $this::read_value($result, 'img');
        return $object;
    }
    private static function read_value($result, $valueToRead) {
        $args = func_get_args();
        $default  = count($args) <= 2 ? null : $args[2];
        //$default = func_get_arg(2);
        return (isset($result[$valueToRead]) && $result[$valueToRead] !== null) ? $result[$valueToRead] : (isset($default) ? $default : '');
    }
}
