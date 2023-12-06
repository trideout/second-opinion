<?php

namespace App\Console\Commands;

use App\Jobs\ProcessMessageJob;
use App\Models\Analysis;
use App\Models\Message;
use App\Models\Opinion;
use Illuminate\Console\Command;

class TestOpinions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-opinions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add all the opinions as messages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $opinions = Opinion::all();
        $messages_created = 0;
        $tests_passed = 0;
        foreach ($opinions as $opinion) {
            $message = Message::create([
                'message_text' => $opinion->message,
                'analysis_statis' => Message::STATUS_UNPROCESSED
            ]);
            dispatch(new ProcessMessageJob($message));
            $messages_created += 1; 
            // $analysis = Analysis::where('message_id', $message->id);
            // if($analysis->raw_response === $opinions->urgency){
            //     $tests_passed++;
            // } else {
            //     $this->alert($message->message_text . PHP_EOL ."our urgency: $opinions->urgency" . PHP_EOL . "OpenAI urgency: $analysis->raw_response");
            // }
        }
        $this->alert($messages_created . ' messages created');
    }
}
