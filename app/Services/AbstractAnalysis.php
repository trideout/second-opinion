<?php
namespace App\Services;

use App\Events\AnalysisCompleteEvent;
use App\Models\Message;

abstract class AbstractAnalysis {
    abstract public function __construct(Message $message);
    abstract public function processMessage(): void;
    public function analysisSuccessful(Message $message) : void {
        $message->refresh();
        $message->analysis_status = Message::STATUS_PROCESSED;
        $message->save();
        event(new AnalysisCompleteEvent($message));
    }
    public function analysisFailed(Message $message): void {
        $message->analysis_status = Message::STATUS_EXCEPTION;
        $message->save();
    }
}
