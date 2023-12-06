<?php

namespace App\GPT\Actions\SecondOpinionGpt;

use App\Models\Analysis;
use App\Models\Message;
use App\Models\Opinion;
use MalteKuhr\LaravelGPT\GPTAction;
use Closure;

class SecondOpinionGPTAction extends GPTAction
{
    public function __construct(private Message $message) {
    }

    /**
     * The message which explains the assistant what to do and which rules to follow.
     *
     * @return string|null
     */
    public function systemMessage(): ?string
    {
        $previousDecisions = Opinion::all()->map(function($row) {
            return 'Message: "' . $row->message . '" Urgency: ' . $row->urgency;
        })->implode(PHP_EOL);
        $prompt = '
            Previous Decisions:
            ' . $previousDecisions . '

            Given the above previous decisions on urgency, and assuming that the patient has a session scheduled within 2 weeks, as the secretary working for a therapist, determine on a scale of 1 to 3 how urgently the message should be presented to the therapist.
            1 would be normal updates from a client to their existing therapist on their mental health and well-being that should wait to be discussed in the next session.
            2 is somewhat urgent and should be addressed before the clients next session.
            3 represents an emergency that should be responded to as soon as possible.

            Explain the reason your urgency was selected.
            Set the temperature to 0.5';
        return $prompt;
    }

    /**
     * Specifies the function to be invoked by the model. The function is implemented as a
     * Closure which may take parameters that are provided by the model. If extra arguments
     * are included in the documentation to optimize model's performance (by allowing it more
     * thinking time), these can be disregarded by not including them within the Closure
     * parameters.
     *
     * @return Closure
     */
    public function function(): Closure
    {
        return function ($urgency, $reason): void {
            $this->message->analysis()->create([
                'provider' => Analysis::PROVIDER_GPT4,
                'raw_response' => $urgency,
                'interpreted_value' => 0,
                'llm_reasoning' => $reason,
            ]);
        };
    }

    /**
     * Defines the rules for input validation and JSON schema generation. Override this
     * method to provide custom validation rules for the function. The documentation will
     * have the same order as the rules are defined in this method.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'urgency' => 'required|integer|IN:1,2,3',
            'reason' => 'required|string',
        ];
    }
}
