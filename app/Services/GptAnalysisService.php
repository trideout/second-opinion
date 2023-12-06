<?php
namespace App\Services;

use App\GPT\Actions\SecondOpinionGpt\SecondOpinionGPTAction;
use App\Models\Analysis;
use App\Models\Message;

class GptAnalysisService implements AnalysisInterface {
    protected Message $message;
    protected $response;
    public function processMessage(Message $message): Analysis
    {
        $this->message = $message;
        SecondOpinionGPTAction::make($message)->send($message->message_text);
        return $this->message->analysis;
    }
}
