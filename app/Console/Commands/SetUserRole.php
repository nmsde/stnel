<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SetUserRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:set-role {email} {role=admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set a user role (admin or member)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $role = $this->argument('role');

        if (!in_array($role, ['admin', 'member'])) {
            $this->error('Role must be either "admin" or "member"');
            return 1;
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found");
            return 1;
        }

        $user->role = $role;
        $user->save();

        $this->info("Successfully set {$user->name} ({$email}) role to: {$role}");
        return 0;
    }
}
