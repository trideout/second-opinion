<?php
namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="Second Opinion API",
 *     version="1.0"
 * )
 */
class SwaggerTest extends Controller {

/**
 * @OA\Get(
 *     path="/messages",
 *     summary="Create a message",
 *     tags={"Messages"},
 *     @OA\Response(response=200, description="Successful operation"),
 *     @OA\Response(response=400, description="Invalid request")
 * )
 */
public function create()
{
    // Create something
}

}
