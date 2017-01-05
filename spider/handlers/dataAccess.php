<?php

/**
 * dataAccess short summary.
 *
 * dataAccess description.
 *
 * @version 1.0
 * @author eduardo.azuaga
 */
class dataAccess
{
    private $PDO = null;
    function getPDO() {
        if (isset($this->PDO)) {
            return $this->PDO;
        } else {
            $this->PDO = $this->getConnectionPDO();
            return $this->PDO;
        }
    }
    private function getConnectionPDO() {
        $host_mysql = constant("host_mysql");
        $db_name = constant("db_name");
        //var_dump($host_mysql);die;
        $dsn = "mysql:dbname={$db_name};host={$host_mysql}";
        $user = constant("user_mysql");
        $password = constant("password_mysql");
        try {
            $pdo = new PDO($dsn, $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            return $pdo;
        }
        catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
            return false;
        }
    }
    function saveProduct($params){
        $pdo = $this->getPDO();
        $handler = new handlerProduct($pdo);
        $handler->save($params);
        
    }
    function GetAllProduct(){
        $pdo = $this->getPDO();
        $handler = new handlerProduct($pdo);
        return $handler->getAll();
        
    }
}
