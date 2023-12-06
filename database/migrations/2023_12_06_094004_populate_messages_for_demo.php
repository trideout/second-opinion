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
            'Is it normal to feel like I am not enough?',
            'Is there something wrong with me?',
            'Do you think that I still need therapy?',
            'How much more therapy do you think that I need?',
            'Do you think that I am an "incel?"',
            'How I stop thinking about her?',
            'The voices are back. Can we make my medication stronger or something?',
            'Have I been making progress in the areas you consider important?',
            'The exercises you gave me haven\'t been working. Do you have other ones I can try out?',
            'I feel like I\'m not making progress towards overcoming my depression. What can you do to help me?',
            'Can we meet more often?',
            'I think I\'m making a lot of progress. Can we meet less often?',
            'I just lost my job, so I\'m going to be stopping therapy for a while. Are there any long-term goals I can work on while I\'m away?',
            'How do I stop feeling like the weight of the world is on my shoulders?',
            'How do I stop feeling anxious around other people?',
            'Am I insane for feeling this way?',
            'Do you think that I\'m ready to stop taking my medications?',
            'Can you prescribe me something to stop me from feeling this way?',
            'When will I be "fixed"?',
            'Why does no one understand me but you?',
            'Can you help me?',
            'My relationship is in shambles. What am I doing wrong?',
            'I\'m so lonely, how do I make friends?',
            'I feel like my wife doesn\'t love me anymore. How do I reignite that spark we used to have?',
            'What do I have to look forward to?',
            'My husband isn\'t talking to me like he used to. Does he not love me anymore?',
            'What is the point of all of this?',
            'Do you feel that therapy is helping me?',
            'How often can we meet?',
            'Can we hang out as friends?',
            'Do you think that birds are real? I have been hearing that they are actually surveillance drones flown by the government?',
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
