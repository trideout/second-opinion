<?php

namespace App\GPT\Actions\SecondOpinionGpt;

use App\Models\Analysis;
use App\Models\Message;
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
        return 'Determine on a scale of 1 to 3 how time critical a response
            to the message from a client to a therapist is. 1 would be casual
            or followup from a client. 2 should be addressed before the
            clients next session. 3 represents an urgent message that should
            be responded to as soon as possible. If the message indicates
            a high likelihood of self harm, flag that ideation as true.';
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
        return function ($urgency, $ideation = false): mixed {
            $this->message->analysis()->create([
                'provider' => Analysis::PROVIDER_GPT35,
                'raw_response' => $urgency,
                'interpreted_value' => $urgency,
            ]);
            return ['urgency' => $urgency, 'ideation' => $ideation];
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
            'urgency' => 'required|integer',
            'ideation' => 'boolean'
        ];
    }
}
