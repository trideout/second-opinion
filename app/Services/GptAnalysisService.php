<?php
namespace App\Services;

use App\Models\Analysis;
use App\Models\Message;

class GptAnalysisService implements AnalysisInterface {
    protected Message $message;
    protected $response;
    public function processMessage(Message $message): Analysis
    {
        $this->message = $message;
        $this->sendToGpt();
        $this->analyseResponse();
        return $this->createResponseRecord();
    }

    protected function sendToGpt(): void {

    }

    protected function analyseResponse(): void {

    }

    protected function createResponseRecord(): Analysis {
        $analysis = Analysis::create([]);
        return $analysis;
    }

}
