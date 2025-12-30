
export type Tab = 'structure' | 'strategies' | 'scripts' | 'query' | 'validations';

export interface Dimension {
  id: string;
  code: string;
  name: string;
  type: 'Scenario' | 'Version' | 'Entity' | 'Year' | 'Period' | 'Account' | 'Generic';
  description?: string;
  binding?: string; // e.g., table column
  isMeasure?: boolean;
}

export interface Strategy {
  id: string;
  code: string;
  name: string;
  type: 'DimensionUD' | 'DataControl';
  relatedDimension: string;
  linkedUD: string;
  targetField: string;
}

export interface Script {
  id: string;
  name: string;
  triggerType: 'Calculation' | 'Validation' | 'ETL';
  content: string;
  blockXml?: string; // Store Blockly XML state
}

export interface ModelConfig {
  code: string;
  name: string;
  factTable: string; // ClickHouse table
  description: string;
}

export interface SavedQuery {
  id: string;
  name: string;
  lastRun: string;
  filters: Record<string, string>;
}

export interface ValidationRule {
    id: string;
    code: string;
    name: string;
    targetAccount: string; // The account storing the diff
    tolerance: number;
    lhs: string; // Left hand side expression, e.g. "Total Assets"
    rhs: string; // Right hand side expression, e.g. "Total Liabilities + Equity"
    scope: Record<string, string>; // Dimension filters (Data Block)
    isActive: boolean;
}