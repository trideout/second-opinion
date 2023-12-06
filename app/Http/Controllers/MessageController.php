<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessMessageJob;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message_text' => 'required',
        ]);

        $message = Message::create([
            'message_text' => $request['message_text'],
            'analysis_status' => Message::STATUS_UNPROCESSED,
        ]);

        dispatch(new ProcessMessageJob($message));

        return response()->json($message);
    }

    public function update(Request $request, Message $message)
    {
        $request->validate([
            'analysis_status' => 'required',
        ]);

        $message->update(['analysis_status' => $request['analysis_status']]);
        return response()->json($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(['success' => true]);
    }

    public function show(Message $message)
    {
        return response()->json($message);
    }
}
