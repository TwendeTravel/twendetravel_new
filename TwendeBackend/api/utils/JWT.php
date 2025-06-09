<?php
class JWT {
    private static $secret_key = 'your-secret-key'; // Change this to a secure key
    private static $algorithm = 'HS256';

    public static function generate($payload) {
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => self::$algorithm
        ]);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function verify($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
        $signature = str_replace(['-', '_'], ['+', '/'], $parts[2]);

        $verifySignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], self::$secret_key, true);
        $verifySignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($verifySignature));

        return hash_equals($signature, $verifySignature) ? json_decode($payload, true) : false;
    }
}