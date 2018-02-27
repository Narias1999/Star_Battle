<?php
class Database{
    private $host = 'localhost';
    private $bd = 'starbattle';
    private $user = 'root';
    private $pass = 'narias';
    public $cnx = null;
    function __construct() {
        $this->getConnection();
    }
    function __destruct() {
        $this->cnx = null;
    }
    public function getConnection() {
        try {
            $this->cnx = new PDO('mysql:host='.$this->host.';dbname='.$this->bd,$this->user, $this->pass);
            $this->cnx->exec();
        } catch(PDOException $e) {
            echo $e;
        }
    }
}
