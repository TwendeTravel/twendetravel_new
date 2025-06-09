<?php

class Role {
    private $db;
    private $table = 'user_roles';

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} (user_id, role) VALUES (:user_id, :role)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute($data);
    }

    public function getCurrentUserRole($userId) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetch();
    }

    public function updateRole($userId, $role) {
        $query = "UPDATE {$this->table} SET role = :role WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            'user_id' => $userId,
            'role' => $role
        ]);
    }

    public function getAllUserRoles() {
        $query = "SELECT ur.*, u.email, u.first_name, u.last_name 
                 FROM {$this->table} ur 
                 JOIN users u ON ur.user_id = u.user_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function deleteRole($userId) {
        $query = "DELETE FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute(['user_id' => $userId]);
    }
}