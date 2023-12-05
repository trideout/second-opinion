<?php
namespace App\Services;

interface AnalysisInterface {
    public function processMessage(\App\Models\Message $message);
}
