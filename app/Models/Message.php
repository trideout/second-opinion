<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_text',
        'analysis_status',
    ];

    public function analysis(): BelongsTo {
        return $this->belongsTo(Analysis::class);
    }
}
