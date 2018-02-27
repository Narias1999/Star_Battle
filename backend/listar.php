<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');
header('Allow-Methods: POST');
include_once 'Conexion.php';
$method = $_SERVER['REQUEST_METHOD'];
$response;
if($method == 'GET') {
    $db = new Database();
    $cnx = $db->cnx;
    $query = 'SELECT * FROM puntajes order by score DESC LIMIT 10';
    $sentence = $cnx->prepare($query);
    if($sentence->execute()) {
        $dbRes = $sentence->fetchAll(PDO::FETCH_ASSOC);
        $response = array(
            'status' => 200,
            'data' => $dbRes
        );
    } else {
        $response = array (
            'status' => 200,
            'message' => 'Error al traer la informacion'
        );
    }

} else {
    $response = array(
        'status' => 400,
        'message' => 'solo se acepta el método get'
    );
}
echo json_encode($response);