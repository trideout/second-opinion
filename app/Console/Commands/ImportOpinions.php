<?php

namespace App\Console\Commands;

use App\Models\Opinion;
use Illuminate\Console\Command;

class ImportOpinions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-opinions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import a CSV of pre-existing opinions with which to train the LLM';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!file_exists(base_path('import.csv'))) {
            $this->error('file "import.csv" does not exist');
            return;
        }
        $imported = 0;
        $file = fopen(base_path('import.csv'));
        while ($row = fgetcsv($file)) {
            if (Opinion::where('message', $row[0])->count()) {
                continue;
            }
            Opinion::create([
                'message' => $row[0],
                'urgency' => $row[1],
            ]);
            $imported++;
        }
        $this->alert($imported . ' opinions imported');
    }
}
