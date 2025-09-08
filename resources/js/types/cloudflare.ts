export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Organisation {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    description?: string;
    timezone: string;
    cloudflare_account_id?: string;
    token_last_validated_at?: string;
    settings?: Record<string, any>;
    created_at: string;
    updated_at: string;

    // Relationships
    owner?: User;
    users?: User[];
    zones?: CloudflareZone[];
    policies?: AccessPolicy[];

    // Counts
    zones_count?: number;
    policies_count?: number;
}

export interface CloudflareZone {
    id: number;
    organisation_id: number;
    zone_id: string;
    name: string;
    status?: string;
    metadata?: Record<string, any>;
    synced_at?: string;
    created_at: string;
    updated_at: string;

    // Relationships
    organisation?: Organisation;
    policies?: AccessPolicy[];
}

export interface PolicyRule {
    type: 'email' | 'domain' | 'group';
    value: string;
}

export interface AccessPolicy {
    id: number;
    organisation_id: number;
    cloudflare_zone_id: number;
    cf_application_id?: string;
    cloudflare_policy_id?: string;
    name: string;
    domain: string;
    path?: string;
    session_duration?: string;
    require_mfa: boolean;
    rules?: PolicyRule[];
    status: 'active' | 'inactive' | 'pending';
    created_by?: number;
    updated_by?: number;
    created_at: string;
    updated_at: string;

    // Relationships
    organisation?: Organisation;
    zone?: CloudflareZone;
    creator?: User;
    updater?: User;

    // Computed attributes
    full_url?: string;
}

export interface AuditLog {
    id: number;
    organisation_id: number;
    user_id: number;
    action: string;
    entity_type?: string;
    entity_id?: number;
    changes?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    created_at: string;

    // Relationships
    organisation?: Organisation;
    user?: User;

    // Computed
    description?: string;
    formatted_changes?: Array<{
        field: string;
        old: any;
        new: any;
    }>;
}

// Form types
export interface CreateOrganisationForm {
    name: string;
    description?: string;
    timezone?: string;
    api_token?: string;
}

export interface UpdateOrganisationForm {
    name?: string;
    description?: string;
    timezone?: string;
    api_token?: string;
}

export interface CreatePolicyForm {
    cloudflare_zone_id: number;
    name: string;
    domain: string;
    path?: string;
    session_duration?: string;
    require_mfa: boolean;
    rules: PolicyRule[];
}

export interface UpdatePolicyForm {
    name?: string;
    domain?: string;
    path?: string;
    session_duration?: string;
    require_mfa?: boolean;
    rules?: PolicyRule[];
}

// Page props
export interface OrganisationIndexProps {
    organisations: Organisation[];
}

export interface OrganisationShowProps {
    organisation: Organisation;
}

export interface OrganisationCreateProps {
    // No additional props needed
}

export interface OrganisationEditProps {
    organisation: Organisation;
}

export interface PolicyIndexProps {
    organisation: Organisation;
    policies: {
        data: AccessPolicy[];
        links: any;
        meta: any;
    };
    zones: CloudflareZone[];
    filters: {
        zone_id?: number;
        status?: string;
    };
}

export interface PolicyShowProps {
    organisation: Organisation;
    policy: AccessPolicy;
}

export interface PolicyCreateProps {
    organisation: Organisation;
    zones: CloudflareZone[];
}

export interface PolicyEditProps {
    organisation: Organisation;
    policy: AccessPolicy;
    zones: CloudflareZone[];
}

export interface AuditLogProps {
    organisation: Organisation;
    logs: {
        data: AuditLog[];
        links: any;
        meta: any;
    };
}
