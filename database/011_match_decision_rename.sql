-- =====================================================
-- PR-011
-- Rename "Duration" to "Match Decision"
-- =====================================================

-- 1. Rename enum
ALTER TYPE match_duration RENAME TO match_decision;

-- =====================================================
-- Predictions
-- =====================================================

ALTER TABLE predictions
RENAME COLUMN predicted_duration TO predicted_match_decision;

-- =====================================================
-- Match Results
-- =====================================================

ALTER TABLE match_results
RENAME COLUMN duration TO match_decision;

-- Remove redundant column
ALTER TABLE match_results
DROP COLUMN IF EXISTS penalties_played;

-- =====================================================
-- Point Breakdown
-- =====================================================

ALTER TABLE point_breakdowns
RENAME COLUMN duration_points TO match_decision_points;

-- =====================================================
-- Rule Configuration
-- =====================================================

UPDATE rule_configuration
SET
    rule_name = 'MATCH_DECISION',
    description = 'Correct match decision (90 mins / Extra Time / Penalty Shootout)'
WHERE rule_name = 'MATCH_DURATION';