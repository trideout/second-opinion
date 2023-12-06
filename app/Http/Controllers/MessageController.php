<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessMessageJob;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/messages",
     *     summary="Get all messages",
     *     tags={"Messages"},
     *     description="Get all messages and their llm reasoning.",
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=400, description="Invalid request")
     * )
     */
    public function index()
    {
        $messages = Message::with('analysis')->get();
        return response()->json($messages);
    }

    /**
     * @OA\Post(
     *     path="/api/messages",
     *     summary="Create a new message",
     *     tags={"Messages"},
     *     description="Create a new message and queue for llm reason processing.",
     *     @OA\Parameter(
     *         name="message_text",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         example="I'm feeling great today!"
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=400, description="Invalid request")
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/api/messages",
     *     summary="Update an analysis status",
     *     tags={"Messages"},
     *     description="Update an analysis status. 0 = unprocessed, 1 = processed, 2 = exception.",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="analysis_status",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=400, description="Invalid request")
     * )
     */
    public function update(Request $request, Message $message)
    {
        $request->validate([
            'analysis_status' => 'required',
        ]);

        $message->update(['analysis_status' => $request['analysis_status']]);
        return response()->json($message);
    }

    /**
     * @OA\Delete(
     *     path="/api/messages/{message_id}",
     *     summary="Delete a message",
     *     tags={"Messages"},
     *     description="Delete a message.",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=400, description="Invalid request")
     * )
     */
    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(['success' => true]);
    }

    /**
     * @OA\Get(
     *     path="/api/messages/{message_id}",
     *     summary="Show a message",
     *     tags={"Messages"},
     *     description="Show a single message and its llm reasoning.",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=400, description="Invalid request")
     * )
     */
    public function show(Message $message)
    {
        $message->load('analysis');
        return response()->json($message);
    }
}
