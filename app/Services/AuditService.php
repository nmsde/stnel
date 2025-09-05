<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Organisation;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AuditService
{
    /**
     * Log a create action.
     */
    public function logCreate(
        Organisation $organisation,
        User $user,
        Model $model,
        string $action = 'created'
    ): AuditLog {
        return AuditLog::log(
            $organisation,
            $user,
            $action,
            class_basename($model),
            $model->id,
            $model->toArray()
        );
    }

    /**
     * Log an update action.
     */
    public function logUpdate(
        Organisation $organisation,
        User $user,
        Model $model,
        array $oldValues,
        string $action = 'updated'
    ): AuditLog {
        $changes = [];
        $newValues = $model->getAttributes();

        foreach ($oldValues as $key => $oldValue) {
            if (isset($newValues[$key]) && $newValues[$key] !== $oldValue) {
                $changes[$key] = [
                    'old' => $oldValue,
                    'new' => $newValues[$key],
                ];
            }
        }

        if (empty($changes)) {
            return null;
        }

        return AuditLog::log(
            $organisation,
            $user,
            $action,
            class_basename($model),
            $model->id,
            $changes
        );
    }

    /**
     * Log a delete action.
     */
    public function logDelete(
        Organisation $organisation,
        User $user,
        Model $model,
        string $action = 'deleted'
    ): AuditLog {
        return AuditLog::log(
            $organisation,
            $user,
            $action,
            class_basename($model),
            $model->id,
            ['deleted_data' => $model->toArray()]
        );
    }

    /**
     * Log a custom action.
     */
    public function logCustom(
        Organisation $organisation,
        User $user,
        string $action,
        ?string $entityType = null,
        ?int $entityId = null,
        ?array $data = null
    ): AuditLog {
        return AuditLog::log(
            $organisation,
            $user,
            $action,
            $entityType,
            $entityId,
            $data
        );
    }

    /**
     * Log a token validation.
     */
    public function logTokenValidation(
        Organisation $organisation,
        User $user,
        bool $success,
        ?string $error = null
    ): AuditLog {
        return $this->logCustom(
            $organisation,
            $user,
            'token_validated',
            'Organisation',
            $organisation->id,
            [
                'success' => $success,
                'error' => $error,
            ]
        );
    }

    /**
     * Log a policy sync.
     */
    public function logPolicySync(
        Organisation $organisation,
        User $user,
        int $policyId,
        bool $success,
        ?string $error = null
    ): AuditLog {
        return $this->logCustom(
            $organisation,
            $user,
            'policy_synced',
            'AccessPolicy',
            $policyId,
            [
                'success' => $success,
                'error' => $error,
            ]
        );
    }

    /**
     * Log a bulk operation.
     */
    public function logBulkOperation(
        Organisation $organisation,
        User $user,
        string $operation,
        string $entityType,
        int $count,
        array $details = []
    ): AuditLog {
        return $this->logCustom(
            $organisation,
            $user,
            "bulk_{$operation}",
            $entityType,
            null,
            array_merge([
                'count' => $count,
            ], $details)
        );
    }
}