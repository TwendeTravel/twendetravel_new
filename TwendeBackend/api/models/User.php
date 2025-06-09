<?php

class User {
    private $db;
    private $table = 'users';

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                 (email, password_hash, first_name, last_name, role) 
                 VALUES (:email, :password_hash, :first_name, :last_name, :role)";
        
        $stmt = $this->db->prepare($query);
        
        // Hash password
        $data['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
        unset($data['password']);
        
        return $stmt->execute($data);
    }

    public function findByEmail($email) {
        $query = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['email' => $email]);
        
        return $stmt->fetch();
    }

    public function findById($user_id) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['user_id' => $user_id]);
        
        return $stmt->fetch();
    }

    public function update($user_id, $data) {
        $fields = [];
        foreach($data as $key => $value) {
            if ($key !== 'user_id') { // Don't update primary key
                $fields[] = "$key = :$key";
            }
        }
        
        $query = "UPDATE {$this->table} SET 
                 " . implode(', ', $fields) . "
                 WHERE user_id = :user_id";
        
        $data['user_id'] = $user_id;
        $stmt = $this->db->prepare($query);
        
        return $stmt->execute($data);
    }

    public function delete($user_id) {
        $query = "DELETE FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        
        return $stmt->execute(['user_id' => $user_id]);
    }

    public function getAll($limit = 10, $offset = 0) {
        $query = "SELECT * FROM {$this->table} LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
}