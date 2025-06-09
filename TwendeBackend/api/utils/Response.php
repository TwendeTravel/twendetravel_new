<?php
class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public static function error($message, $status = 400) {
        self::json(['error' => $message], $status);
    }

    public static function success($data = null, $message = 'Success', $status = 200) {
        $response = ['message' => $message];
        if ($data !== null) {
            $response['data'] = $data;
        }
        self::json($response, $status);
    }
}