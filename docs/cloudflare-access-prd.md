# Product Requirements Document: Cloudflare Access Management

## Executive Summary

Integration of Cloudflare Zero Trust Access management capabilities into our SaaS platform, enabling SMB customers to manage access policies for their domains through a simplified interface while maintaining enterprise-grade security.

---

## 1. Problem Statement & Goals

### Problem
SMBs struggle with complex Cloudflare Access configurations and lack centralized tools to manage access policies across multiple domains and applications. Direct Cloudflare dashboard usage requires technical expertise and doesn't integrate with existing business workflows.

### Goals
- **Primary**: Enable non-technical administrators to create and manage Cloudflare Access policies through an intuitive interface
- **Secondary**: Provide centralized management for multiple Cloudflare accounts/zones
- **Tertiary**: Reduce security incidents through simplified MFA enforcement and clear access controls

### Success Metrics
- 80% reduction in time to configure new access policies
- Zero security incidents from token exposure
- <2 minutes average time to create a new policy
- 95% API call success rate

---

## 2. User Personas

### Primary: SMB IT Administrator
- **Technical Level**: Basic to intermediate
- **Needs**: Simple interface, bulk operations, clear error messages
- **Pain Points**: Complex Cloudflare UI, managing multiple accounts
- **Use Frequency**: Weekly

### Secondary: Developer/DevOps
- **Technical Level**: Advanced
- **Needs**: API access, automation capabilities, detailed logs
- **Pain Points**: Manual policy updates, lack of version control
- **Use Frequency**: Daily

### Tertiary: Compliance Officer
- **Technical Level**: Non-technical
- **Needs**: Audit logs, MFA enforcement reports, access reviews
- **Pain Points**: Proving compliance, tracking changes
- **Use Frequency**: Monthly

---

## 3. Functional Requirements

### 3.1 Organisation Management
- **Create Organisation**: Name, description, timezone, primary contact
- **Edit Organisation**: Update details, change primary contact
- **Delete Organisation**: Soft delete with 30-day recovery period
- **List Organisations**: Paginated view with search/filter
- **Organisation Switching**: Quick switcher in header for multi-org users

### 3.2 API Token Management
- **Add Token**: Secure input field with validation
- **Token Validation**: Real-time verification against Cloudflare API
- **Token Rotation**: Schedule automated rotation reminders
- **Permissions Check**: Validate required scopes (Access, DNS)
- **Encryption**: AES-256 encryption at rest using Laravel's encryption

### 3.3 Policy Management
- **List Policies**: View existing Access applications/policies
- **Create Policy**:
  - Select domain/subdomain
  - Define path patterns (e.g., `/admin/*`)
  - Set allowed emails/domains
  - Configure session duration
  - Enable/disable MFA requirement
- **Edit Policy**: Modify all parameters with change tracking
- **Delete Policy**: Soft delete with confirmation dialog
- **Bulk Operations**: Apply policies to multiple domains

### 3.4 Access Rules
- **Email-based**: Individual email addresses
- **Domain-based**: Entire email domains (e.g., `@company.com`)
- **Group-based**: Cloudflare Access groups
- **Service Token**: For machine-to-machine access
- **Bypass Rules**: IP ranges for emergency access

### 3.5 MFA Configuration
- **Global MFA**: Enforce for all policies in organisation
- **Per-Policy MFA**: Toggle for specific applications
- **MFA Methods**: Configure allowed methods (TOTP, WebAuthn, etc.)

---

## 4. User Flows

### Flow 1: Initial Setup
1. Admin registers/logs into platform
2. Creates new Organisation
3. Enters Cloudflare API token
4. System validates token and fetches zones
5. Dashboard displays available domains

### Flow 2: Create Access Policy
1. Admin selects Organisation
2. Clicks "Create Policy"
3. Selects domain from dropdown
4. Enters subdomain/path pattern
5. Adds allowed emails/domains
6. Toggles MFA requirement
7. Sets session duration
8. Reviews and confirms
9. System creates policy via CF API
10. Success notification with policy details

### Flow 3: Manage Existing Policy
1. Admin views policy list
2. Filters by domain/status
3. Clicks edit on specific policy
4. Modifies rules/settings
5. System shows diff preview
6. Confirms changes
7. Updates via CF API
8. Audit log entry created

---

## 5. Non-Functional Requirements

### 5.1 Security
- **Token Storage**: AES-256-GCM encryption with per-organisation keys
- **Token Access**: Decrypted only during API calls, never logged
- **Audit Logging**: All actions logged with actor, timestamp, changes
- **RBAC**: Organisation admin, editor, viewer roles
- **Session Management**: 2-hour timeout, concurrent session limits
- **API Security**: Rate limiting, IP allowlisting option

### 5.2 Performance
- **Response Time**: <200ms for UI operations
- **API Calls**: <2s for Cloudflare API operations
- **Caching**: 5-minute cache for read operations
- **Pagination**: 50 items per page default

### 5.3 Reliability
- **Availability**: 99.9% uptime SLA
- **Error Handling**: Graceful degradation, retry logic
- **Rate Limiting**: Respect Cloudflare's limits (1200 req/5min)
- **Queue Processing**: Async for bulk operations

### 5.4 Scalability
- **Organisations**: Support 10,000+ organisations
- **Policies**: 1,000+ policies per organisation
- **Concurrent Users**: 100+ simultaneous editors

---

## 6. Acceptance Criteria

### Organisation Management
- [ ] Can create organisation with valid details
- [ ] Cannot create duplicate organisation names
- [ ] Can edit organisation details
- [ ] Soft delete preserves data for 30 days
- [ ] Only organisation admins can manage settings

### Token Management
- [ ] Token stored encrypted in database
- [ ] Invalid tokens rejected with clear error
- [ ] Token never appears in logs
- [ ] Can update token without losing policies
- [ ] Token validation checks required scopes

### Policy Management
- [ ] Can create policy for any verified domain
- [ ] Email validation prevents invalid addresses
- [ ] MFA toggle updates immediately
- [ ] Bulk operations process asynchronously
- [ ] Changes reflected in Cloudflare within 30s

### Security
- [ ] No plaintext tokens in database
- [ ] Audit log captures all changes
- [ ] Rate limiting prevents API abuse
- [ ] RBAC enforced on all endpoints
- [ ] XSS/CSRF protection on all forms

---

# Implementation Plan

## Backend (Laravel)

### Database Schema

```sql
-- organisations table
CREATE TABLE organisations (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    cloudflare_account_id VARCHAR(255),
    encrypted_api_token TEXT,
    token_last_validated_at TIMESTAMP,
    settings JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_slug (slug),
    INDEX idx_user (user_id)
);

-- organisation_users pivot table
CREATE TABLE organisation_users (
    id BIGINT PRIMARY KEY,
    organisation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    invited_by BIGINT,
    joined_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organisation_id) REFERENCES organisations(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_org_user (organisation_id, user_id)
);

-- cloudflare_zones table
CREATE TABLE cloudflare_zones (
    id BIGINT PRIMARY KEY,
    organisation_id BIGINT NOT NULL,
    zone_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    metadata JSON,
    synced_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organisation_id) REFERENCES organisations(id),
    INDEX idx_zone_id (zone_id)
);

-- access_policies table
CREATE TABLE access_policies (
    id BIGINT PRIMARY KEY,
    organisation_id BIGINT NOT NULL,
    cloudflare_zone_id BIGINT NOT NULL,
    cf_application_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    path VARCHAR(255),
    session_duration VARCHAR(50),
    require_mfa BOOLEAN DEFAULT FALSE,
    rules JSON,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_by BIGINT,
    updated_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (organisation_id) REFERENCES organisations(id),
    FOREIGN KEY (cloudflare_zone_id) REFERENCES cloudflare_zones(id),
    INDEX idx_cf_app_id (cf_application_id)
);

-- audit_logs table
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY,
    organisation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    changes JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (organisation_id) REFERENCES organisations(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_org_created (organisation_id, created_at)
);
```

### Models & Relationships

```php
// app/Models/Organisation.php
class Organisation extends Model {
    use SoftDeletes, HasFactory;
    
    protected $casts = [
        'settings' => 'array',
        'token_last_validated_at' => 'datetime'
    ];
    
    protected $hidden = ['encrypted_api_token'];
    
    public function users() {
        return $this->belongsToMany(User::class)
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }
    
    public function zones() {
        return $this->hasMany(CloudflareZone::class);
    }
    
    public function policies() {
        return $this->hasMany(AccessPolicy::class);
    }
    
    public function getApiTokenAttribute() {
        return decrypt($this->encrypted_api_token);
    }
    
    public function setApiTokenAttribute($value) {
        $this->attributes['encrypted_api_token'] = encrypt($value);
    }
}
```

### Service Layer

```php
// app/Services/CloudflareService.php
class CloudflareService {
    private $client;
    
    public function __construct(private Organisation $organisation) {
        $this->client = new CloudflareClient($organisation->api_token);
    }
    
    public function validateToken(): bool
    public function listZones(): array
    public function listApplications(string $zoneId): array
    public function createApplication(array $data): CloudflareApplication
    public function updateApplication(string $appId, array $data): CloudflareApplication
    public function deleteApplication(string $appId): bool
    public function testConnection(): array
}

// app/Services/AccessPolicyService.php
class AccessPolicyService {
    public function __construct(
        private CloudflareService $cloudflare,
        private AuditService $audit
    ) {}
    
    public function create(array $data): AccessPolicy
    public function update(AccessPolicy $policy, array $data): AccessPolicy
    public function delete(AccessPolicy $policy): bool
    public function sync(AccessPolicy $policy): bool
    public function bulkCreate(array $policies): Collection
}
```

### API Controllers

```php
// app/Http/Controllers/Api/OrganisationController.php
class OrganisationController {
    public function index(): JsonResponse
    public function store(StoreOrganisationRequest $request): JsonResponse
    public function show(Organisation $organisation): JsonResponse
    public function update(UpdateOrganisationRequest $request, Organisation $organisation): JsonResponse
    public function destroy(Organisation $organisation): JsonResponse
    public function validateToken(Request $request, Organisation $organisation): JsonResponse
}

// app/Http/Controllers/Api/AccessPolicyController.php
class AccessPolicyController {
    public function index(Organisation $organisation): JsonResponse
    public function store(StoreAccessPolicyRequest $request, Organisation $organisation): JsonResponse
    public function show(Organisation $organisation, AccessPolicy $policy): JsonResponse
    public function update(UpdateAccessPolicyRequest $request, Organisation $organisation, AccessPolicy $policy): JsonResponse
    public function destroy(Organisation $organisation, AccessPolicy $policy): JsonResponse
    public function bulkCreate(BulkCreateRequest $request, Organisation $organisation): JsonResponse
}
```

### Jobs & Queues

```php
// app/Jobs/SyncCloudflareZones.php
class SyncCloudflareZones implements ShouldQueue {
    public function handle(): void {
        // Fetch and sync zones from Cloudflare
    }
}

// app/Jobs/ValidateApiTokens.php
class ValidateApiTokens implements ShouldQueue {
    public function handle(): void {
        // Periodic validation of all stored tokens
    }
}

// app/Jobs/ProcessBulkPolicyCreation.php
class ProcessBulkPolicyCreation implements ShouldQueue {
    public function handle(): void {
        // Handle bulk policy creation asynchronously
    }
}
```

### Authorization Policies

```php
// app/Policies/OrganisationPolicy.php
class OrganisationPolicy {
    public function view(User $user, Organisation $organisation): bool {
        return $organisation->users()
            ->where('user_id', $user->id)
            ->exists();
    }
    
    public function update(User $user, Organisation $organisation): bool {
        return $organisation->users()
            ->where('user_id', $user->id)
            ->whereIn('role', ['admin', 'editor'])
            ->exists();
    }
    
    public function delete(User $user, Organisation $organisation): bool {
        return $organisation->users()
            ->where('user_id', $user->id)
            ->where('role', 'admin')
            ->exists();
    }
}
```

---

## Frontend (React/TypeScript)

### Component Structure

```
resources/js/
├── pages/
│   ├── organisations/
│   │   ├── index.tsx          // List organisations
│   │   ├── create.tsx          // Create organisation
│   │   ├── [id]/
│   │   │   ├── edit.tsx       // Edit organisation
│   │   │   ├── settings.tsx   // Organisation settings
│   │   │   └── policies/
│   │   │       ├── index.tsx  // List policies
│   │   │       ├── create.tsx // Create policy
│   │   │       └── [id]/
│   │   │           └── edit.tsx
├── components/
│   ├── organisations/
│   │   ├── OrganisationForm.tsx
│   │   ├── OrganisationList.tsx
│   │   ├── OrganisationSwitcher.tsx
│   │   └── TokenInput.tsx
│   ├── policies/
│   │   ├── PolicyForm.tsx
│   │   ├── PolicyList.tsx
│   │   ├── PolicyRuleBuilder.tsx
│   │   ├── EmailRuleInput.tsx
│   │   ├── MFAToggle.tsx
│   │   └── BulkActions.tsx
│   └── shared/
│       ├── AuditLog.tsx
│       ├── ConfirmDialog.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useOrganisation.ts
│   ├── useCloudflareApi.ts
│   ├── usePolicies.ts
│   └── useAuditLog.ts
├── services/
│   ├── api/
│   │   ├── organisations.ts
│   │   ├── policies.ts
│   │   └── cloudflare.ts
│   └── validation/
│       ├── token.ts
│       └── policy.ts
└── types/
    ├── organisation.ts
    ├── policy.ts
    └── cloudflare.ts
```

### Key Components

```tsx
// components/organisations/TokenInput.tsx
export function TokenInput({ organisation, onSave }: TokenInputProps) {
    const [token, setToken] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleValidate = async () => {
        setIsValidating(true);
        try {
            const result = await validateToken(organisation.id, token);
            if (result.valid) {
                await onSave(token);
                toast.success('Token validated and saved');
            }
        } catch (err) {
            setError('Invalid token or insufficient permissions');
        } finally {
            setIsValidating(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cloudflare API Token</CardTitle>
                <CardDescription>
                    Enter a token with Access and DNS permissions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="cf_xxxxxxxxxxxx"
                    />
                    {error && <Alert variant="destructive">{error}</Alert>}
                    <Button 
                        onClick={handleValidate}
                        disabled={!token || isValidating}
                    >
                        {isValidating ? 'Validating...' : 'Validate & Save'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// components/policies/PolicyRuleBuilder.tsx
export function PolicyRuleBuilder({ policy, onChange }: PolicyRuleBuilderProps) {
    const [rules, setRules] = useState<PolicyRule[]>(policy.rules || []);
    
    const addEmailRule = (email: string) => {
        const newRule: EmailRule = {
            type: 'email',
            value: email,
            id: generateId()
        };
        const updated = [...rules, newRule];
        setRules(updated);
        onChange(updated);
    };
    
    const addDomainRule = (domain: string) => {
        const newRule: DomainRule = {
            type: 'domain',
            value: domain,
            id: generateId()
        };
        const updated = [...rules, newRule];
        setRules(updated);
        onChange(updated);
    };
    
    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {rules.map((rule) => (
                    <RuleItem 
                        key={rule.id} 
                        rule={rule}
                        onRemove={() => removeRule(rule.id)}
                    />
                ))}
            </div>
            <div className="flex gap-2">
                <EmailRuleInput onAdd={addEmailRule} />
                <DomainRuleInput onAdd={addDomainRule} />
            </div>
        </div>
    );
}
```

### API Integration

```typescript
// services/api/policies.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePolicies(organisationId: string) {
    return useQuery({
        queryKey: ['policies', organisationId],
        queryFn: () => fetchPolicies(organisationId),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useCreatePolicy() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CreatePolicyData) => createPolicy(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['policies', variables.organisationId]);
            toast.success('Policy created successfully');
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Failed to create policy');
        }
    });
}

export function useBulkCreatePolicies() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: BulkCreateData) => bulkCreatePolicies(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['policies', variables.organisationId]);
            toast.success(`${data.created} policies created successfully`);
        }
    });
}
```

### State Management

```typescript
// stores/organisationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrganisationStore {
    currentOrganisation: Organisation | null;
    organisations: Organisation[];
    setCurrentOrganisation: (org: Organisation) => void;
    addOrganisation: (org: Organisation) => void;
    updateOrganisation: (id: string, updates: Partial<Organisation>) => void;
}

export const useOrganisationStore = create<OrganisationStore>()(
    persist(
        (set) => ({
            currentOrganisation: null,
            organisations: [],
            setCurrentOrganisation: (org) => set({ currentOrganisation: org }),
            addOrganisation: (org) => set((state) => ({
                organisations: [...state.organisations, org]
            })),
            updateOrganisation: (id, updates) => set((state) => ({
                organisations: state.organisations.map(
                    org => org.id === id ? { ...org, ...updates } : org
                )
            }))
        }),
        {
            name: 'organisation-storage',
            partialize: (state) => ({ currentOrganisation: state.currentOrganisation })
        }
    )
);
```

---

## Security & Compliance Considerations

### Security Requirements

1. **Token Security**
   - Never log API tokens in plaintext
   - Use Laravel's encryption for storage
   - Implement token rotation reminders
   - Token access auditing

2. **Data Protection**
   - TLS 1.3 for all API communications
   - Encrypted database connections
   - Regular security scans
   - PII data minimization

3. **Access Control**
   - Implement RBAC at organisation level
   - Session timeout after 2 hours
   - MFA for admin accounts
   - IP allowlisting option

4. **Audit & Compliance**
   - Log all configuration changes
   - Immutable audit logs
   - Data retention policies
   - GDPR compliance for EU customers

### Cloudflare API Compliance

1. **Terms of Service**
   - Not reselling Cloudflare services
   - Clear attribution to Cloudflare
   - Respecting API rate limits
   - Proper error handling

2. **Best Practices**
   - Use least-privilege API tokens
   - Implement exponential backoff
   - Cache read operations
   - Handle API deprecations gracefully

### Error Handling

```typescript
// Standardized error handling
class CloudflareApiError extends Error {
    constructor(
        public code: string,
        public status: number,
        message: string,
        public details?: any
    ) {
        super(message);
    }
}

// Rate limit handling
async function withRateLimit<T>(
    fn: () => Promise<T>,
    retries = 3
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (error.status === 429 && retries > 0) {
            const delay = error.headers['Retry-After'] || 60;
            await sleep(delay * 1000);
            return withRateLimit(fn, retries - 1);
        }
        throw error;
    }
}
```

---

## Development & Testing Next Steps

### Phase 1: Foundation (Week 1-2)
1. **Database Setup**
   - Create migrations for all tables
   - Seed test data
   - Set up model relationships

2. **Basic CRUD**
   - Organisation management
   - Token encryption/decryption
   - Basic authentication

3. **Testing**
   - Unit tests for encryption
   - Model relationship tests
   - Basic API endpoint tests

### Phase 2: Cloudflare Integration (Week 3-4)
1. **API Client**
   - Implement CloudflareService
   - Token validation
   - Zone listing

2. **Policy Management**
   - Create/update policies
   - Sync with Cloudflare
   - Error handling

3. **Testing**
   - Mock Cloudflare API responses
   - Integration tests
   - Error scenario testing

### Phase 3: Frontend Development (Week 5-6)
1. **Core UI**
   - Organisation pages
   - Policy management interface
   - Token input component

2. **Advanced Features**
   - Bulk operations
   - Rule builder
   - MFA configuration

3. **Testing**
   - Component tests with React Testing Library
   - E2E tests with Playwright
   - Accessibility testing

### Phase 4: Security & Performance (Week 7)
1. **Security Hardening**
   - Security audit
   - Penetration testing
   - RBAC implementation

2. **Performance**
   - API response caching
   - Query optimization
   - Frontend lazy loading

3. **Documentation**
   - API documentation
   - User guides
   - Admin documentation

### Phase 5: Beta Testing (Week 8)
1. **Internal Testing**
   - QA team testing
   - Load testing
   - Security review

2. **Beta Release**
   - Select customer testing
   - Feedback collection
   - Bug fixes

3. **Production Readiness**
   - Monitoring setup
   - Alert configuration
   - Rollback procedures

### Testing Checklist

#### Unit Tests
- [ ] Token encryption/decryption
- [ ] Model relationships
- [ ] Service methods
- [ ] API validations
- [ ] React components

#### Integration Tests
- [ ] API endpoint flows
- [ ] Cloudflare API integration
- [ ] Database transactions
- [ ] Queue processing
- [ ] Authentication flows

#### E2E Tests
- [ ] Organisation creation flow
- [ ] Policy management flow
- [ ] Token validation flow
- [ ] Error recovery flows
- [ ] Multi-user scenarios

#### Security Tests
- [ ] SQL injection
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Token exposure

#### Performance Tests
- [ ] API response times
- [ ] Database query optimization
- [ ] Frontend bundle size
- [ ] Concurrent user load
- [ ] Queue processing speed

---

## Monitoring & Success Metrics

### Technical Metrics
- API response time < 200ms (p95)
- Cloudflare API success rate > 95%
- Zero security incidents
- 99.9% uptime

### Business Metrics
- User adoption rate
- Policy creation frequency
- Time to first policy
- Customer satisfaction score

### Operational Metrics
- Support ticket volume
- Error rate by feature
- Token validation failures
- API rate limit hits