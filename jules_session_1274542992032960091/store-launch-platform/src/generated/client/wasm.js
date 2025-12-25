
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.10.2
 * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
 */
Prisma.prismaVersion = {
  client: "5.10.2",
  engine: "5a9203d0590c951969e85a7d07215503f4672eb9"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  password_hash: 'password_hash',
  role: 'role',
  created_at: 'created_at'
};

exports.Prisma.StoreScalarFieldEnum = {
  id: 'id',
  name: 'name',
  country: 'country',
  city: 'city',
  address: 'address',
  timezone: 'timezone',
  status: 'status',
  planned_open_date: 'planned_open_date',
  actual_open_date: 'actual_open_date',
  contract_signed_date: 'contract_signed_date',
  template_version: 'template_version',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  version: 'version',
  is_active: 'is_active',
  created_at: 'created_at'
};

exports.Prisma.TemplatePhaseScalarFieldEnum = {
  id: 'id',
  template_id: 'template_id',
  name: 'name',
  order: 'order'
};

exports.Prisma.TemplateTaskScalarFieldEnum = {
  id: 'id',
  phase_id: 'phase_id',
  name: 'name',
  description: 'description',
  role_responsible: 'role_responsible',
  duration_days: 'duration_days',
  anchor_event: 'anchor_event',
  offset_days: 'offset_days',
  workday_rule: 'workday_rule',
  is_milestone: 'is_milestone',
  dependency_indices: 'dependency_indices'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  store_id: 'store_id',
  title: 'title',
  description: 'description',
  phase: 'phase',
  status: 'status',
  priority: 'priority',
  start_date: 'start_date',
  due_date: 'due_date',
  completed_at: 'completed_at',
  role: 'role',
  manual_override: 'manual_override',
  locked: 'locked',
  reschedule_mode: 'reschedule_mode',
  calendar_rule: 'calendar_rule',
  anchor: 'anchor',
  owner_id: 'owner_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TaskDependencyScalarFieldEnum = {
  task_id: 'task_id',
  depends_on_id: 'depends_on_id'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  store_id: 'store_id',
  name: 'name',
  type: 'type',
  date: 'date',
  status: 'status'
};

exports.Prisma.IssueScalarFieldEnum = {
  id: 'id',
  store_id: 'store_id',
  title: 'title',
  severity: 'severity',
  status: 'status',
  mitigation: 'mitigation'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  store_id: 'store_id',
  name: 'name',
  url: 'url',
  type: 'type'
};

exports.Prisma.IngredientScalarFieldEnum = {
  id: 'id',
  name: 'name',
  unit_type: 'unit_type',
  category: 'category'
};

exports.Prisma.GroceryPriceScalarFieldEnum = {
  id: 'id',
  country: 'country',
  retailer: 'retailer',
  ingredient_id: 'ingredient_id',
  package_size: 'package_size',
  package_unit: 'package_unit',
  price: 'price',
  currency: 'currency',
  normalized_price_per_unit: 'normalized_price_per_unit',
  as_of: 'as_of',
  source_url: 'source_url'
};

exports.Prisma.PriceHistoryScalarFieldEnum = {
  id: 'id',
  grocery_price_id: 'grocery_price_id',
  price: 'price',
  changed_at: 'changed_at',
  changed_by: 'changed_by',
  reason: 'reason'
};

exports.Prisma.RecipeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  menu_item: 'menu_item',
  version: 'version',
  country: 'country',
  yield_count: 'yield_count',
  target_cost_pct: 'target_cost_pct',
  manual_price: 'manual_price',
  created_at: 'created_at'
};

exports.Prisma.RecipeLineScalarFieldEnum = {
  id: 'id',
  recipe_id: 'recipe_id',
  ingredient_id: 'ingredient_id',
  quantity: 'quantity',
  unit: 'unit'
};

exports.Prisma.CompetitorPriceScalarFieldEnum = {
  id: 'id',
  country: 'country',
  brand: 'brand',
  menu_item: 'menu_item',
  price: 'price',
  currency: 'currency',
  as_of: 'as_of'
};

exports.Prisma.FXRateScalarFieldEnum = {
  id: 'id',
  from_currency: 'from_currency',
  to_currency: 'to_currency',
  rate: 'rate',
  date: 'date'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  entity_type: 'entity_type',
  entity_id: 'entity_id',
  action: 'action',
  changes: 'changes',
  user_id: 'user_id',
  created_at: 'created_at'
};

exports.Prisma.NotificationLogScalarFieldEnum = {
  id: 'id',
  type: 'type',
  recipient: 'recipient',
  payload: 'payload',
  status: 'status',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Store: 'Store',
  Template: 'Template',
  TemplatePhase: 'TemplatePhase',
  TemplateTask: 'TemplateTask',
  Task: 'Task',
  TaskDependency: 'TaskDependency',
  Milestone: 'Milestone',
  Issue: 'Issue',
  Document: 'Document',
  Ingredient: 'Ingredient',
  GroceryPrice: 'GroceryPrice',
  PriceHistory: 'PriceHistory',
  Recipe: 'Recipe',
  RecipeLine: 'RecipeLine',
  CompetitorPrice: 'CompetitorPrice',
  FXRate: 'FXRate',
  AuditLog: 'AuditLog',
  NotificationLog: 'NotificationLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions or Edge Middleware',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
