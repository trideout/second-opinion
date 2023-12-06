<?php

namespace App\Http\Controllers;

use App\Http\Requests\OpinionStoreRequest;
use App\Models\Analysis;
use App\Models\Message;
use App\Models\Opinion;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class OpinionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * @OA\Post(
     *     path="/api/opinions",
     *     summary="Create a new opinion",
     *     tags={"Opinions"},
     *     description="Create a new opinion to help train the llm in future analyses.",
     *      @OA\Parameter(
     *          name="message_id",
     *          in="query",
     *          required=true,
     *          @OA\Schema(type="integer"),
     *          example="1"
     *      ),
     *     @OA\Parameter(
     *         name="message",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string"),
     *         example="I'm feeling great today!"
     *     ),
     *     @OA\Parameter(
     *         name="urgency",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="integer"),
     *         example="1"
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=400, description="Invalid request")
     * )
     */
    public function store(OpinionStoreRequest $request)
    {
        $analysis = Analysis::where('message_id', $request->message_id)->first();
        $analysis->interpreted_value = $request->urgency;
        $analysis->save();

        $opinion = Opinion::create([
            'message' => $request->message,
            'urgency' => $request->urgency,
        ]);

        return response()->json($opinion);
    }

    /**
     * Display the specified resource.
     */
    public function show(Opinion $opinion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Opinion $opinion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Opinion $opinion)
    {

    }
}
