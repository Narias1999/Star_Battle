<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');
header('Allow-Methods: POST');
include_once 'Conexion.php';
$method = $_SERVER['REQUEST_METHOD'];
$response;
if($method == 'POST') {
    $db = new Database();
    $cnx = $db->cnx;
    $username = $_POST['username'];
    $minutes = $_POST['minutes'];
    $seconds = $_POST['seconds'];
    $score = $_POST['score'];
    $query = 'INSERT INTO puntajes SET username=:username, score=:score, minutes=:minutes, seconds=:seconds';
    $sentence = $cnx->prepare($query);
    $sentence->bindParam(':username', $username);
    $sentence->bindParam(':minutes', $minutes);
    $sentence->bindParam(':seconds', $seconds);
    $sentence->bindParam(':score', $score);
    if($sentence->execute()) {
        $response = array(
            'status' => 200,
            'message' => 'Puntaje ingresado con exito'
        );
    } else {
        $response = array(
            'status' => 400,
            'message' => 'Error al ingresar el puntaje'
        );
    }
} else {
    $response = array(
        'status' => 400,
        'message' => 'Solo su puede hacer esta petición por el método POST'
    );
}
echo json_encode($response);