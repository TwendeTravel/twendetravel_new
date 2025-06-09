<?php
require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';

class Auth {
    public static function authenticate() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if (!$token) {
            Response::json(['error' => 'No token provided'], 401);
            return false;
        }

        $payload = JWT::verify($token);
        if (!$payload) {
            Response::json(['error' => 'Invalid token'], 401);
            return false;
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            Response::json(['error' => 'Token expired'], 401);
            return false;
        }

        return $payload;
    }

    public static function requireRole($requiredRole) {
        $payload = self::authenticate();
        if (!$payload) return false;

        if ($payload['role'] !== $requiredRole && $payload['role'] !== 'admin') {
            Response::json(['error' => 'Insufficient permissions'], 403);
            return false;
        }

        return $payload;
    }
}