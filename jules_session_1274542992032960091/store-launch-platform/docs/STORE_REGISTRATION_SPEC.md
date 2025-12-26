# Store Registration & Management Module - Technical Specification

## Document Information
- **Feature:** Store Registration & Management
- **Priority:** MVP Critical
- **Constraint:** FREE TIER ONLY
- **Estimated Effort:** 2-3 days
- **Target PR:** Separate from documentation PR

---

## Executive Summary

This specification defines a complete Store Registration and Management module for the Store Launch Platform. The module must enable full CRUD operations for store entities, maintain history of critical changes (especially planned opening dates), and support document upload/download for store-related files (contracts, permits, etc.).

**Critical Requirement:** All features MUST be implementable using FREE tier services only. No paid subscriptions, no credit card requirements.

---

## 1. Business Requirements

### 1.1 Core Functionality
- Create new store records with franchisee information
- Edit existing stores while maintaining change history
- Track multiple planned opening dates (append-only history)
- Upload and manage store-related documents (contracts, permits, photos)
- Display stores in an expandable card interface
- Support both temporary and official store naming

### 1.2 Display Priority Rules
1. **Store Name Display:**
   - If `official_name` exists → display `official_name`
   - Else → display `temp_name`
   - At least one must be provided

2. **Opening Date Display:**
   - Always show the most recent date from `planned_open_dates[]` array
   - When editing, append new date (don't overwrite)
   - Preserve full history for audit purposes

### 1.3 User Roles & Permissions
- **ADMIN:** Full access (create, edit, delete, upload files)
- **PM:** Full access (create, edit, upload files)
- **CONTRIBUTOR:** Read and update assigned stores
- **VIEWER:** Read-only access

---

## 2. Data Model Specification

### 2.1 Store Model Extensions

```prisma
model Store {
  id                  String    @id @default(cuid())
  
  // Existing fields (keep as-is)
  name                String
  country             String
  city                String
  timezone            String
  planned_open_date   DateTime?
  status              String
  template_version    Int
  created_at          DateTime  @default(now())
  updated_at          DateTime  @updatedAt
  
  // NEW FIELDS
  temp_name           String?
  official_name       String?
  owner_name          String
  owner_phone         String
  owner_email         String
  owner_address       String
  store_phone         String?
  store_location      String?
  planned_open_dates  DateTime[] // JSON array in SQLite
  
  // Relations
  tasks               Task[]
  milestones          Milestone[]
  files               StoreFile[]  // NEW
  
  @@index([country])
  @@index([status])
}
```

**Migration Notes:**
- `planned_open_dates` stores as JSON array in SQLite
- Migrate existing `planned_open_date` to `planned_open_dates[0]`
- Set default values for new required fields in migration

### 2.2 New StoreFile Model

```prisma
model StoreFile {
  id              String   @id @default(cuid())
  store_id        String
  file_name       String
  file_type       String   // MIME type
  file_size       Int      // bytes
  storage_path    String   // Supabase path or local path
  uploaded_by     String   // User email from cookie
  uploaded_at     DateTime @default(now())
  
  store           Store    @relation(fields: [store_id], references: [id], onDelete: Cascade)
  
  @@index([store_id])
  @@index([uploaded_at])
}
```

**File Constraints:**
- Max size: 10 MB (10,485,760 bytes)
- Allowed MIME types:
  - `application/pdf`
  - `image/png`, `image/jpeg`
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX)
  - `application/vnd.ms-excel` (XLS)
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)
  - `application/msword` (DOC)

---

## 3. API Specification

### 3.1 Store CRUD Endpoints

#### GET /api/stores
**Description:** List all stores

**Query Parameters:**
- `search?: string` - Search by name
- `country?: string` - Filter by country
- `status?: string` - Filter by status

**Response:**
```json
{
  "stores": [
    {
      "id": "store123",
      "displayName": "Official Store Name",
      "displayOpenDate": "2025-06-01T00:00:00Z",
      "owner_name": "John Doe",
      "owner_phone": "+1234567890",
      "country": "MX",
      "status": "PLANNING"
    }
  ]
}
```

#### POST /api/stores
**Description:** Create new store

**Request Body:**
```json
{
  "temp_name": "Temp Store",
  "official_name": null,
  "owner_name": "John Doe",
  "owner_phone": "+1234567890",
  "owner_email": "john@example.com",
  "owner_address": "123 Main St",
  "store_phone": "+0987654321",
  "store_location": "Downtown",
  "planned_open_date": "2025-06-01",
  "country": "MX",
  "city": "Mexico City",
  "timezone": "America/Mexico_City"
}
```

**Validation:**
- At least one of `temp_name` or `official_name` required
- `owner_name`, `owner_phone`, `owner_email`, `owner_address` required
- Email format validation
- Phone number basic validation
- `planned_open_date` cannot be in the past

**Response:** 201 Created + store object

#### PATCH /api/stores/[id]
**Description:** Update store

**Special Behavior:**
- If `planned_open_date` is changed:
  - Append new date to `planned_open_dates[]`
  - Update `planned_open_date` field
  - Log change in audit (future enhancement)

**Request Body:** Partial store object

**Response:** 200 OK + updated store

#### DELETE /api/stores/[id]
**Description:** Delete store (cascade deletes files)

**Response:** 204 No Content

### 3.2 File Management Endpoints

#### POST /api/stores/[id]/files
**Description:** Upload file

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file`: File blob

**Server-Side Validation:**
1. Check file size ≤ 10 MB
2. Validate MIME type against allowed list
3. Sanitize filename (remove path traversal)
4. Generate unique storage path

**Storage Strategy:**
```typescript
// Priority 1: Supabase Storage
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const path = `${storeId}/${Date.now()}_${sanitizedFilename}`
  await supabase.storage.from('store-files').upload(path, file)
}
// Priority 2: Local filesystem
else {
  const dir = `public/uploads/stores/${storeId}`
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(`${dir}/${filename}`, buffer)
}
```

**Response:**
```json
{
  "file": {
    "id": "file123",
    "file_name": "contract.pdf",
    "file_type": "application/pdf",
    "file_size": 1048576,
    "uploaded_at": "2025-12-25T..."
  }
}
```

#### GET /api/stores/[id]/files
**Description:** List files for store

**Response:**
```json
{
  "files": [
    {
      "id": "file123",
      "file_name": "contract.pdf",
      "file_type": "application/pdf",
      "file_size": 1048576,
      "uploaded_by": "admin@example.com",
      "uploaded_at": "2025-12-25T..."
    }
  ]
}
```

#### GET /api/stores/[id]/files/[fileId]
**Description:** Download file

**Response:** File stream with appropriate headers
```typescript
res.setHeader('Content-Type', file.file_type)
res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`)
res.send(fileBuffer)
```

**Implementation:**
```typescript
// Supabase
const { data } = await supabase.storage
  .from('store-files')
  .createSignedUrl(file.storage_path, 60) // 60 sec

// Local
const filePath = path.join(process.cwd(), file.storage_path)
const stream = fs.createReadStream(filePath)
stream.pipe(res)
```

#### DELETE /api/stores/[id]/files/[fileId]
**Description:** Delete file

**Response:** 204 No Content

---

## 4. UI/UX Specification

### 4.1 Store List Page (`/dashboard/stores`)

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  StoreLaunch     Overview  Stores  Pricing    Logout│
├─────────────────────────────────────────────────────┤
│  Stores                              [+ New Store]  │
│  ┌───────────────────────────────────────────┐      │
│  │ Official Store Name              ▼        │      │
│  │ Owner: John Doe | +1234567890             │      │
│  │ Opens: Jun 1, 2025                        │      │
│  └───────────────────────────────────────────┘      │
│  ┌───────────────────────────────────────────┐      │
│  │ Temp Store 2                     ▼        │      │
│  │ Owner: Jane Smith | +0987654321           │      │
│  │ Opens: Aug 15, 2025                       │      │
│  └───────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
```

**Expanded Card:**
```
┌───────────────────────────────────────────┐
│ Official Store Name              ▲        │
│ Owner: John Doe | +1234567890             │
│ Opens: Jun 1, 2025                        │
│                                            │
│ Contact Information:                      │
│ • Email: john@example.com                 │
│ • Address: 123 Main St, Mexico City       │
│ • Store Phone: +0987654321                │
│ • Location: Downtown                      │
│                                            │
│ Opening Date History:                     │
│ • Jun 1, 2025 (current)                   │
│ • May 15, 2025                            │
│ • May 1, 2025                             │
│                                            │
│ [Edit Store] [Upload File] [View Files]  │
└───────────────────────────────────────────┘
```

**Interactions:**
- Click anywhere on card (except buttons) to expand/collapse
- Smooth animation for expand/collapse
- Mobile: Stack cards vertically
- Desktop: 2-3 columns grid

### 4.2 Create Store Form (`/dashboard/stores/new`)

**Form Layout:**
```
Create New Store
────────────────

Store Names
• Temporary Name: [________________]
• Official Name:  [________________] (optional)

Franchisee Information
• Owner Name:     [________________] *
• Phone:          [________________] *
• Email:          [________________] *
• Address:        [________________] *

Store Information
• Store Phone:    [________________]
• Location:       [________________]
• Country:        [▼ Select Country]
• City:           [________________]
• Timezone:       [▼ Select Timezone]

Opening Information
• Planned Date:   [📅 Select Date]  *

[Cancel]  [Create Store]
```

**Validation:**
- Real-time validation on blur
- Show error messages inline
- Disable submit until valid
- Phone: Basic format check (numbers, +, -, spaces)
- Email: RFC 5322 format
- Date: Must be future date

### 4.3 File Upload Interface

**Component Design:**
```
┌─────────────────────────────────────┐
│  Drag & drop files here            │
│  or click to browse                │
│                                     │
│  📎 Supported: PDF, Images, Office │
│  📊 Max size: 10 MB per file       │
└─────────────────────────────────────┘

Uploaded Files
────────────────────────────────────────
📄 contract.pdf
   1.2 MB • Uploaded Dec 25, 2025
   by admin@example.com
   [Download] [Delete]

📄 permit.pdf  
   856 KB • Uploaded Dec 20, 2025
   by pm@example.com
   [Download] [Delete]
```

**Features:**
- Drag-and-drop zone with hover state
- Click to open file picker
- Show upload progress bar
- Display file list immediately after upload
- Confirmation dialog before delete

---

## 5. Testing Specification

### 5.1 E2E Test Scenario (Playwright)

```typescript
test('Store CRUD and File Management E2E', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:3000')
  await page.click('input[value="admin@example.com"]')
  await page.click('button:has-text("Enter Platform")')
  
  // 2. Navigate to Stores
  await page.click('a:has-text("Stores")')
  
  // 3. Create new store
  await page.click('button:has-text("New Store")')
  await page.fill('input[name="temp_name"]', 'E2E Test Store')
  await page.fill('input[name="owner_name"]', 'Test Owner')
  await page.fill('input[name="owner_phone"]', '+1234567890')
  await page.fill('input[name="owner_email"]', 'test@example.com')
  await page.fill('input[name="owner_address"]', '123 Test St')
  await page.fill('input[name="planned_open_date"]', '2025-12-31')
  await page.click('button:has-text("Create Store")')
  
  // 4. Verify store created
  await expect(page.locator('text=E2E Test Store')).toBeVisible()
  
  // 5. Edit store - change opening date
  await page.click('text=E2E Test Store')
  await page.click('button:has-text("Edit Store")')
  await page.fill('input[name="planned_open_date"]', '2026-01-15')
  await page.click('button:has-text("Save Changes")')
  
  // 6. Verify date history
  await page.click('text=E2E Test Store')
  await expect(page.locator('text=Jan 15, 2026')).toBeVisible()
  await expect(page.locator('text=Dec 31, 2025')).toBeVisible()
  
  // 7. Upload file
  await page.click('button:has-text("Upload File")')
  const fileInput = await page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/test-contract.pdf')
  await expect(page.locator('text=test-contract.pdf')).toBeVisible()
  
  // 8. Refresh page - verify persistence
  await page.reload()
  await expect(page.locator('text=test-contract.pdf')).toBeVisible()
  
  // 9. Download file
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Download")').first()
  ])
  expect(download.suggestedFilename()).toBe('test-contract.pdf')
  
  // 10. Delete file
  await page.click('button:has-text("Delete")').first()
  await page.click('button:has-text("Confirm")')
  await expect(page.locator('text=test-contract.pdf')).not.toBeVisible()
})
```

### 5.2 Unit Tests (API Routes)

```typescript
describe('POST /api/stores', () => {
  it('should create store with valid data', async () => {
    const res = await request(app)
      .post('/api/stores')
      .send({ /* valid data */ })
    expect(res.status).toBe(201)
    expect(res.body.store.id).toBeDefined()
  })
  
  it('should reject if no name provided', async () => {
    const res = await request(app)
      .post('/api/stores')
      .send({ /* no temp_name or official_name */ })
    expect(res.status).toBe(400)
  })
  
  it('should append to planned_open_dates on update', async () => {
    // Create store
    const store = await createStore({ planned_open_date: '2025-06-01' })
    
    // Update date
    await request(app)
      .patch(`/api/stores/${store.id}`)
      .send({ planned_open_date: '2025-07-01' })
    
    // Verify history
    const updated = await getStore(store.id)
    expect(updated.planned_open_dates).toHaveLength(2)
    expect(updated.planned_open_dates[1]).toBe('2025-07-01')
  })
})

describe('POST /api/stores/[id]/files', () => {
  it('should upload valid file', async () => {
    const res = await request(app)
      .post(`/api/stores/${storeId}/files`)
      .attach('file', 'tests/fixtures/test.pdf')
    expect(res.status).toBe(201)
  })
  
  it('should reject file > 10MB', async () => {
    const res = await request(app)
      .post(`/api/stores/${storeId}/files`)
      .attach('file', 'tests/fixtures/large.pdf') // 11 MB
    expect(res.status).toBe(413)
  })
  
  it('should reject invalid MIME type', async () => {
    const res = await request(app)
      .post(`/api/stores/${storeId}/files`)
      .attach('file', 'tests/fixtures/malware.exe')
    expect(res.status).toBe(415)
  })
})
```

---

## 6. Free Tier Compliance

### 6.1 Supabase Setup (FREE Tier)

**Limits:**
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 2 GB/month
- API Requests: Unlimited (with rate limits)

**Setup Steps:**
1. Create Supabase project (free)
2. Create `store-files` storage bucket
3. Set bucket to private (require authentication)
4. Get credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`

**Storage Configuration:**
```sql
-- Run in Supabase SQL editor
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'store-files');

CREATE POLICY "Allow authenticated downloads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'store-files');
```

### 6.2 Local Fallback

**Environment Detection:**
```typescript
const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL
const storageProvider = useSupabase ? 'supabase' : 'local'
```

**Local Storage Implementation:**
```typescript
// app/lib/storage.ts
export async function uploadFile(
  file: File,
  storeId: string
): Promise<string> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Supabase upload
    const path = `${storeId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('store-files')
      .upload(path, file)
    if (error) throw error
    return path
  } else {
    // Local upload
    const dir = `public/uploads/stores/${storeId}`
    await fs.mkdir(dir, { recursive: true })
    const filename = `${Date.now()}_${file.name}`
    await fs.writeFile(`${dir}/${filename}`, Buffer.from(await file.arrayBuffer()))
    return `/uploads/stores/${storeId}/${filename}`
  }
}
```

---

## 7. Security Considerations

### 7.1 File Upload Security

**Checks:**
1. **File Type Validation (Server-Side):**
   ```typescript
   const allowedTypes = [
     'application/pdf',
     'image/png',
     'image/jpeg',
     // ... other allowed types
   ]
   
   if (!allowedTypes.includes(file.type)) {
     return res.status(415).json({ error: 'Unsupported file type' })
   }
   ```

2. **Filename Sanitization:**
   ```typescript
   const sanitizeFilename = (filename: string) => {
     return filename
       .replace(/[^a-zA-Z0-9.-]/g, '_')
       .replace(/\.\.+/g, '.')
       .substring(0, 255)
   }
   ```

3. **Path Traversal Prevention:**
   ```typescript
   const safePath = path.normalize(uploadPath).replace(/^(\.\.(\/|\\|$))+/, '')
   if (!safePath.startsWith('public/uploads/')) {
     throw new Error('Invalid path')
   }
   ```

4. **Size Limit Enforcement:**
   ```typescript
   export const config = {
     api: {
       bodyParser: {
         sizeLimit: '10mb'
       }
     }
   }
   ```

### 7.2 Access Control

**Middleware:**
```typescript
export async function requireAuth(req: NextRequest) {
  const userCookie = req.cookies.get('user_id')
  if (!userCookie) {
    return new Response('Unauthorized', { status: 401 })
  }
  return userCookie.value
}

export async function requireRole(req: NextRequest, allowedRoles: string[]) {
  const email = await requireAuth(req)
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !allowedRoles.includes(user.role)) {
    return new Response('Forbidden', { status: 403 })
  }
}
```

---

## 8. Environment Variables

```env
# .env.local (for local development)

# Database (SQLite - no configuration needed)
DATABASE_URL="file:./prisma/store_launch.db"

# Supabase (optional - for file storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your-service-key"

# File Upload
MAX_FILE_SIZE=10485760  # 10 MB in bytes
```

**Setup Instructions:**
```markdown
## Setup

1. Copy `.env.example` to `.env.local`
2. (Optional) Add Supabase credentials for cloud storage
3. If no Supabase credentials, files will be stored locally in `public/uploads/`
```

---

## 9. Success Metrics

### 9.1 Functional Requirements
- ✅ Store can be created with all required fields
- ✅ Store can be edited and changes are persisted
- ✅ Opening date history is maintained (append-only)
- ✅ Display name prioritizes official_name
- ✅ Display date shows most recent from history
- ✅ Files can be uploaded (with validation)
- ✅ Files can be downloaded
- ✅ Files can be deleted
- ✅ E2E test passes

### 9.2 Non-Functional Requirements
- ✅ Runs on FREE tier only (no paid services)
- ✅ Works with local SQLite
- ✅ Works with Supabase free tier
- ✅ File storage works locally and on Supabase
- ✅ Responsive on mobile and desktop
- ✅ Accessible (keyboard navigation, screen readers)

---

## 10. Rollout Plan

### Phase 1: Schema & API (Day 1)
- [ ] Update Prisma schema
- [ ] Create and run migrations
- [ ] Implement Store CRUD APIs
- [ ] Implement File APIs
- [ ] Unit tests for APIs

### Phase 2: UI Components (Day 2)
- [ ] Create store list page
- [ ] Build expandable cards
- [ ] Create/edit forms
- [ ] File upload component
- [ ] File list component

### Phase 3: Integration & Testing (Day 3)
- [ ] Integrate UI with APIs
- [ ] E2E test
- [ ] Manual testing
- [ ] Screenshots for PR
- [ ] Documentation updates

---

## Appendix: Code Examples

### A1: Display Name Helper

```typescript
// app/lib/store-helpers.ts
export function getDisplayName(store: Store): string {
  return store.official_name || store.temp_name || 'Unnamed Store'
}

export function getDisplayOpenDate(store: Store): Date | null {
  if (!store.planned_open_dates || store.planned_open_dates.length === 0) {
    return store.planned_open_date
  }
  const sorted = [...store.planned_open_dates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )
  return sorted[0]
}
```

### A2: File Upload Component

```typescript
'use client'

export default function FileUpload({ storeId }: { storeId: string }) {
  const [uploading, setUploading] = useState(false)
  
  const handleUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch(`/api/stores/${storeId}/files`, {
      method: 'POST',
      body: formData
    })
    
    if (res.ok) {
      // Refresh file list
      router.refresh()
    } else {
      const error = await res.json()
      alert(error.message)
    }
    setUploading(false)
  }
  
  return (
    <div
      onDrop={(e) => {
        e.preventDefault()
        handleUpload(e.dataTransfer.files[0])
      }}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed p-8 text-center cursor-pointer hover:bg-gray-50"
    >
      <input
        type="file"
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        📎 Drag & drop files here or click to browse
        <div className="text-sm text-gray-500 mt-2">
          PDF, Images, Office files • Max 10 MB
        </div>
      </label>
    </div>
  )
}
```

---

**End of Specification**
