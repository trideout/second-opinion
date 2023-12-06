<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Analysis extends Model
{
    use HasFactory;

    const PROVIDER_GPT35 = 1;
    const PROVIDER_GPT4 = 2;
    protected $fillable = [
        'provider',
        'raw_response',
        'interpreted_value',
        'llm_reasoning',
    ];

    public function message(): BelongsTo {
        return $this->belongsTo(Message::class);
    }
}
