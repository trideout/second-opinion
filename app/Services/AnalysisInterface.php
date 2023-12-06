<?php
namespace App\Services;

use App\Models\Message;

interface AnalysisInterface {
    public function __construct(Message $message);
    public function processMessage();
}
