<?php

namespace App\Jobs;

use App\Exceptions\AnalysisException;
use App\Models\Message;
use App\Services\GptAnalysisService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(protected Message $message)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $service = new GptAnalysisService($this->message);
        try {
            $service->processMessage();
            $service->analysisSuccessful($this->message);
        } catch (AnalysisException $exception) {
            $service->analysisFailed($this->message);
        }
    }
}
