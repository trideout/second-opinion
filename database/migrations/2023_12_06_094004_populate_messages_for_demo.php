<?php

use App\Jobs\ProcessMessageJob;
use App\Models\Message;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $questions = collect([
            'Am I a normal teenager?',
            'Im thinking about ending things',
            'everything seems pretty good actually',
        ]);
        $questions->each(function ($question) {
            $message = Message::factory()->create([
                'message_text' => $question,
            ]);
            dispatch(new ProcessMessageJob($message));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
