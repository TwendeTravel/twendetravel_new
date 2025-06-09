<?php
require_once __DIR__ . '/../models/Role.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/Auth.php';

class RoleController {
    private $role;

    public function __construct() {
        $this->role = new Role();
    }

    public function getCurrentRole() {
        $payload = Auth::authenticate();
        if (!$payload) return;

        $userRole = $this->role->getCurrentUserRole($payload['user_id']);
        if ($userRole) {
            Response::json($userRole);
        } else {
            Response::json(['error' => 'Role not found'], 404);
        }
    }

    public function createRole() {
        $payload = Auth::requireRole('admin');
        if (!$payload) return;

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['user_id']) || !isset($data['role'])) {
            Response::json(['error' => 'Missing required fields'], 400);
            return;
        }

        if ($this->role->create($data)) {
            Response::json(['message' => 'Role created successfully'], 201);
        } else {
            Response::json(['error' => 'Failed to create role'], 500);
        }
    }

    public function updateRole() {
        $payload = Auth::requireRole('admin');
        if (!$payload) return;

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data['user_id']) || !isset($data['role'])) {
            Response::json(['error' => 'Missing required fields'], 400);
            return;
        }

        if ($this->role->updateRole($data['user_id'], $data['role'])) {
            Response::json(['message' => 'Role updated successfully']);
        } else {
            Response::json(['error' => 'Failed to update role'], 500);
        }
    }

    public function getAllRoles() {
        $payload = Auth::requireRole('admin');
        if (!$payload) return;

        $roles = $this->role->getAllUserRoles();
        Response::json($roles);
    }
}