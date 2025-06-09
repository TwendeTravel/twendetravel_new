<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Response.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Parse the URL
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = trim($path, '/');
$segments = explode('/', $path);

// Remove 'api' from the beginning if present
if ($segments[0] === 'api') {
    array_shift($segments);
}

// Get the controller and action
$controller = ucfirst($segments[0] ?? '') . 'Controller';
$action = $segments[1] ?? 'index';

// Load the controller
$controller_path = __DIR__ . '/controllers/' . $controller . '.php';

if (file_exists($controller_path)) {
    require_once $controller_path;
    $controller_instance = new $controller();
    if (method_exists($controller_instance, $action)) {
        $controller_instance->$action();
    } else {
        Response::error('Method not found', 404);
    }
} else {
    Response::error('Controller not found', 404);
}

// ... existing code ...

// Role routes
$router->get('/roles/current', function() use ($roleController) {
    $roleController->getCurrentRole();
});

$router->post('/roles', function() use ($roleController) {
    $roleController->createRole();
});

$router->put('/roles', function() use ($roleController) {
    $roleController->updateRole();
});

$router->get('/roles', function() use ($roleController) {
    $roleController->getAllRoles();
});

// ... existing code ...