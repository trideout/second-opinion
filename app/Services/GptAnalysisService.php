<?php
namespace App\Services;

use App\GPT\Actions\SecondOpinionGpt\SecondOpinionGPTAction;
use App\Models\Analysis;
use App\Models\Message;

class GptAnalysisService implements AnalysisInterface {
    public function __construct(protected Message $message) {}

    public function processMessage(): Analysis
    {
        SecondOpinionGPTAction::make($this->message)->send($this->message->message_text);
        $this->analysisSuccessful();
        return $this->message->analysis;
    }

    private function analysisSuccessful() : void {
        $this->message->analysis_status = Message::STATUS_PROCESSED;
        $this->message->save();
    }
}
