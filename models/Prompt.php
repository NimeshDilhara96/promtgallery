<?php
// Prompt.php - MongoDB Model (Updated database path)

class Prompt {
    private $client;
    private $dbName;
    private $collection;

    public function __construct() {
        require_once('/var/www/secure_config/database.php');

        $dbInstance = Database::getInstance();
        $this->client = $dbInstance->getClient(); // MongoDB\Driver\Manager
        $this->dbName = $dbInstance->getDatabase(); // database name string
        $this->collection = "prompts"; // collection name
    }

    // Helper to convert MongoDB objects to arrays
    private function convertToArray($document) {
        if (is_object($document)) {
            $document = (array) $document;
        }

        if (isset($document['_id']) && is_object($document['_id'])) {
            $document['_id'] = (string) $document['_id'];
        }

        if (isset($document['stats']) && is_object($document['stats'])) {
            $document['stats'] = (array) $document['stats'];
        }

        if (isset($document['created_at']) && is_object($document['created_at'])) {
            $document['created_at'] = date('Y-m-d H:i:s', $document['created_at']->toDateTime()->getTimestamp());
        }

        if (isset($document['updated_at']) && is_object($document['updated_at'])) {
            $document['updated_at'] = date('Y-m-d H:i:s', $document['updated_at']->toDateTime()->getTimestamp());
        }

        return $document;
    }

    // Generate slug from title
    private function generateSlug($title) {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        
        // Make unique if needed
        $originalSlug = $slug;
        $counter = 1;
        while ($this->getBySlug($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    // Get all prompts
    public function getAll($filter = [], $options = []) {
        try {
            $query = new MongoDB\Driver\Query($filter, $options);
            $cursor = $this->client->executeQuery($this->dbName . '.' . $this->collection, $query);

            $prompts = [];
            foreach ($cursor as $document) {
                $prompts[] = $this->convertToArray($document);
            }
            return $prompts;
        } catch (Exception $e) {
            error_log("Error fetching prompts: " . $e->getMessage());
            return [];
        }
    }

    // Get prompt by ID
    public function getById($id) {
        try {
            $result = $this->getAll(['_id' => new MongoDB\BSON\ObjectId($id)]);
            return $result[0] ?? null;
        } catch (Exception $e) {
            error_log("Error getting prompt by ID: " . $e->getMessage());
            return null;
        }
    }

    // Get prompt by slug
    public function getBySlug($slug) {
        return $this->getAll(['slug' => $slug])[0] ?? null;
    }

    // Get prompts by category
    public function getByCategory($category, $options = []) {
        return $this->getAll(['category' => ['$in' => [$category]]], $options);
    }

    // Search prompts
    public function search($searchTerm, $options = []) {
        $filter = [
            '$or' => [
                ['title' => new MongoDB\BSON\Regex($searchTerm, 'i')],
                ['prompt' => new MongoDB\BSON\Regex($searchTerm, 'i')],
                ['tags' => new MongoDB\BSON\Regex($searchTerm, 'i')]
            ]
        ];
        return $this->getAll($filter, $options);
    }

    // Create new prompt
    public function create($data) {
        // Add creation timestamp
        $data['created_at'] = new MongoDB\BSON\UTCDateTime();
        $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            
            // Generate slug if not provided
            $slug = isset($data['slug']) ? $data['slug'] : $this->generateSlug($data['title']);
            
            $document = [
                'title' => $data['title'],
                'slug' => $slug,
                'prompt' => $data['prompt'],
                'category' => $data['category'],
                'image' => isset($data['image']) ? $data['image'] : '',
                'platform' => isset($data['platform']) ? $data['platform'] : 'All Platforms',
                'tags' => isset($data['tags']) ? $data['tags'] : [],
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime(),
                'stats' => [
                    'views' => 0,
                    'copies' => 0
                ]
            ];
            
            $insertedId = $bulk->insert($document);
            
            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $this->client->executeBulkWrite($this->dbName . '.' . $this->collection, $bulk, $writeConcern);
            
            error_log("Insert result - Inserted count: " . $result->getInsertedCount());
            
            return $result->getInsertedCount() > 0;
        } catch (Exception $e) {
            error_log("Error creating prompt: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return false;
        }
    }

    // Update prompt
    public function update($id, $data) {
        // Add update timestamp
        $data['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            $filter = ['_id' => new MongoDB\BSON\ObjectId($id)];
            
            // Prepare update data
            $updateData = $data;
            $updateData['updated_at'] = new MongoDB\BSON\UTCDateTime();
            
            $update = ['$set' => $updateData];
            
            $bulk->update($filter, $update, ['multi' => false, 'upsert' => false]);
            
            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $this->client->executeBulkWrite($this->dbName . '.' . $this->collection, $bulk, $writeConcern);
            
            return $result->getModifiedCount() > 0 || $result->getMatchedCount() > 0;
        } catch (Exception $e) {
            error_log("Error updating prompt: " . $e->getMessage());
            return false;
        }
    }

    // Delete prompt
    public function delete($id) {
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            $bulk->delete(['_id' => new MongoDB\BSON\ObjectId($id)], ['limit' => 1]);
            
            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $this->client->executeBulkWrite($this->dbName . '.' . $this->collection, $bulk, $writeConcern);
            
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            error_log("Error deleting prompt: " . $e->getMessage());
            return false;
        }
    }

    // Increment views
    public function incrementViews($id) {
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            $filter = ['_id' => new MongoDB\BSON\ObjectId($id)];
            $update = [
                '$inc' => ['stats.views' => 1],
                '$set' => ['updated_at' => new MongoDB\BSON\UTCDateTime()]
            ];
            
            $bulk->update($filter, $update, ['multi' => false, 'upsert' => false]);
            
            $result = $this->client->executeBulkWrite($this->dbName . '.' . $this->collection, $bulk);
            return $result->getModifiedCount() > 0;
        } catch (Exception $e) {
            error_log("Error incrementing views: " . $e->getMessage());
            return false;
        }
    }

    // Increment copies
    public function incrementCopies($id) {
        try {
            $bulk = new MongoDB\Driver\BulkWrite;
            $filter = ['_id' => new MongoDB\BSON\ObjectId($id)];
            $update = [
                '$inc' => ['stats.copies' => 1],
                '$set' => ['updated_at' => new MongoDB\BSON\UTCDateTime()]
            ];
            
            $bulk->update($filter, $update, ['multi' => false, 'upsert' => false]);
            
            $result = $this->client->executeBulkWrite($this->dbName . '.' . $this->collection, $bulk);
            return $result->getModifiedCount() > 0;
        } catch (Exception $e) {
            error_log("Error incrementing copies: " . $e->getMessage());
            return false;
        }
    }

    // Get all unique categories
    public function getCategories() {
        try {
            $command = new MongoDB\Driver\Command([
                'distinct' => $this->collection,
                'key' => 'category'
            ]);
            $cursor = $this->client->executeCommand($this->dbName, $command);
            $result = current($cursor->toArray());

            $categories = [];
            if (isset($result->values)) {
                foreach ($result->values as $value) {
                    if (is_array($value)) {
                        $categories = array_merge($categories, $value);
                    } else {
                        $categories[] = $value;
                    }
                }
            }
            return array_unique($categories);
        } catch (Exception $e) {
            error_log("Error fetching categories: " . $e->getMessage());
            return [];
        }
    }

    // Count documents
    public function count($filter = []) {
        try {
            $command = new MongoDB\Driver\Command([
                'count' => $this->collection,
                'query' => $filter
            ]);
            $cursor = $this->client->executeCommand($this->dbName, $command);
            $result = current($cursor->toArray());
            return $result->n ?? 0;
        } catch (Exception $e) {
            error_log("Error counting prompts: " . $e->getMessage());
            return 0;
        }
    }
}
?>
