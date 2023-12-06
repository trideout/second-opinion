<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Message extends Model
{
    const STATUS_UNPROCESSED = 0;
    const STATUS_PROCESSED = 1;
    const STATUS_EXCEPTION = 2;

    use HasFactory;

    protected $fillable = [
        'message_text',
        'analysis_status',
    ];

    protected $attributes = [
        'analysis_status' => self::STATUS_UNPROCESSED,
    ];

    public function analysis(): HasOne {
        return $this->hasOne(Analysis::class);
    }
}
