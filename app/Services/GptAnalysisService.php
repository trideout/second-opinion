<?php
namespace App\Services;

use App\Events\AnalysisCompleteEvent;
use App\Exceptions\AnalysisException;
use App\GPT\Actions\SecondOpinionGpt\SecondOpinionGPTAction;
use App\Models\Analysis;
use App\Models\Message;

class GptAnalysisService extends AbstractAnalysis {
    public function __construct(protected Message $message) {}

    public function processMessage(): void
    {
        try {
            SecondOpinionGPTAction::make($this->message)->send($this->message->message_text);
        } catch (\Exception $exception) {
            throw new AnalysisException($exception->getMessage());
        }
    }
}
