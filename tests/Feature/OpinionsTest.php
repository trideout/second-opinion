<?php

namespace Tests\Feature;

use App\Models\Opinion;
use App\GPT\Actions\SecondOpinionGpt\SecondOpinionGPTAction;
use Tests\TestCase;

class OpinionsTest extends TestCase
{
    public function validate_opinions_test(): void
    {
        $correct_guesses = 0;
        $opinions = Opinion::all();

        foreach ($opinions as $opinion) {
            SecondOpinionGPTAction::make($opinion)->send($opinion->message);
            $opinion->reload();
            if ($opinion->analysis->interpreted_value === $opinion->urgency) {
                $correct_guesses++;
            }
        }

        $this->assertEquals($opinions->count(), $correct_guesses);
    }
}
