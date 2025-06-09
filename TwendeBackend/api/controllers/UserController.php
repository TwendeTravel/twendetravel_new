<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JWT.php';

class UserController {
    private $user;

    public function __construct() {
        $this->user = new User();
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            Response::json(['error' => 'Missing required fields'], 400);
            return;
        }

        // Check if user already exists
        if ($this->user->findByEmail($data['email'])) {
            Response::json(['error' => 'Email already registered'], 409);
            return;
        }

        // Set default role if not provided
        if (!isset($data['role'])) {
            $data['role'] = 'user';
        }

        if ($this->user->create($data)) {
            $user = $this->user->findByEmail($data['email']);
            unset($user['password_hash']);
            
            // Generate JWT token
            $token = JWT::generate([
                'user_id' => $user['user_id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'exp' => time() + (60 * 60 * 24) // 24 hours expiration
            ]);

            Response::json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token
            ], 201);
        } else {
            Response::json(['error' => 'Registration failed'], 500);
        }
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            Response::json(['error' => 'Missing required fields'], 400);
            return;
        }

        $user = $this->user->findByEmail($data['email']);

        if ($user && password_verify($data['password'], $user['password_hash'])) {
            unset($user['password_hash']);
            
            // Generate JWT token
            $token = JWT::generate([
                'user_id' => $user['user_id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'exp' => time() + (60 * 60 * 24) // 24 hours expiration
            ]);

            Response::json([
                'user' => $user,
                'token' => $token
            ]);
        } else {
            Response::json(['error' => 'Invalid credentials'], 401);
        }
    }

    public function getProfile() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if (!$token) {
            Response::json(['error' => 'No token provided'], 401);
            return;
        }

        $payload = JWT::verify($token);
        if (!$payload) {
            Response::json(['error' => 'Invalid token'], 401);
            return;
        }

        $user = $this->user->findById($payload['user_id']);
        if ($user) {
            unset($user['password_hash']);
            Response::json(['user' => $user]);
        } else {
            Response::json(['error' => 'User not found'], 404);
        }
    }
}