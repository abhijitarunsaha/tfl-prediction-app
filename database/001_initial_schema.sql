-- ==========================================================
-- TFL Prediction App
-- Migration: 001_initial_schema.sql
-- ==========================================================

create extension if not exists "pgcrypto";

------------------------------------------------------------
-- ENUMS
------------------------------------------------------------

create type match_stage as enum (
    'GROUP',
    'ROUND_OF_32',
    'ROUND_OF_16',
    'QUARTER_FINAL',
    'SEMI_FINAL',
    'FINAL'
);

create type prediction_result as enum (
    'HOME',
    'DRAW',
    'AWAY'
);

create type match_duration as enum (
    'NINETY_MINUTES',
    'EXTRA_TIME',
    'PENALTY_SHOOTOUT'
);

create type match_status as enum (
    'SCHEDULED',
    'LIVE',
    'COMPLETED'
);

------------------------------------------------------------
-- CONTESTANTS
------------------------------------------------------------

create table contestants
(
    id uuid primary key default gen_random_uuid(),

    name text not null unique,

    created_at timestamptz default now()
);

------------------------------------------------------------
-- MATCHES
------------------------------------------------------------

create table matches
(
    id uuid primary key default gen_random_uuid(),

    match_number integer not null,

    stage match_stage not null,

    kickoff timestamptz,

    home_team text not null,

    away_team text not null,

    status match_status default 'SCHEDULED',

    created_at timestamptz default now()
);

------------------------------------------------------------
-- PREDICTIONS
------------------------------------------------------------

create table predictions
(
    id uuid primary key default gen_random_uuid(),

    contestant_id uuid not null
        references contestants(id)
        on delete cascade,

    match_id uuid not null
        references matches(id)
        on delete cascade,

    predicted_result prediction_result,

    predicted_home_goals integer default 0,

    predicted_away_goals integer default 0,

    predicted_duration match_duration,

    manual_override integer default 0,

    override_reason text,

    created_at timestamptz default now(),

    updated_at timestamptz default now(),

    unique(contestant_id, match_id)
);

------------------------------------------------------------
-- SCORER PREDICTIONS
------------------------------------------------------------

create table prediction_scorers
(
    id uuid primary key default gen_random_uuid(),

    prediction_id uuid not null
        references predictions(id)
        on delete cascade,

    player_name text not null
);

------------------------------------------------------------
-- MATCH RESULTS
------------------------------------------------------------

create table match_results
(
    id uuid primary key default gen_random_uuid(),

    match_id uuid unique
        references matches(id)
        on delete cascade,

    ---------------------------------------------------------
    -- SCORE AFTER 90 MINUTES
    ---------------------------------------------------------

    home_goals_ft integer default 0,

    away_goals_ft integer default 0,

    ---------------------------------------------------------
    -- SCORE AFTER EXTRA TIME
    -- (Includes FT goals)
    ---------------------------------------------------------

    home_goals_final integer default 0,

    away_goals_final integer default 0,

    ---------------------------------------------------------
    -- Penalties
    ---------------------------------------------------------

    penalties_played boolean default false,

    home_penalties integer,

    away_penalties integer,

    ---------------------------------------------------------
    -- Winner
    ---------------------------------------------------------

    winner prediction_result,

    duration match_duration,

    created_at timestamptz default now()
);

------------------------------------------------------------
-- ACTUAL GOAL SCORERS
------------------------------------------------------------

create table match_scorers
(
    id uuid primary key default gen_random_uuid(),

    match_result_id uuid not null
        references match_results(id)
        on delete cascade,

    player_name text not null,

    goals integer default 1
);

------------------------------------------------------------
-- POINT BREAKDOWN
------------------------------------------------------------

create table point_breakdowns
(
    id uuid primary key default gen_random_uuid(),

    prediction_id uuid not null
        references predictions(id)
        on delete cascade,

    result_points integer default 0,

    score_points integer default 0,

    goal_difference_points integer default 0,

    scorer_points integer default 0,

    duration_points integer default 0,

    overprediction_penalty integer default 0,

    manual_override integer default 0,

    total_points integer default 0,

    calculated_at timestamptz default now()
);

------------------------------------------------------------
-- RULE CONFIGURATION
------------------------------------------------------------

create table rule_configuration
(
    rule_name text primary key,

    rule_value integer not null,

    description text
);

------------------------------------------------------------
-- INDEXES
------------------------------------------------------------

create index idx_predictions_match
on predictions(match_id);

create index idx_predictions_contestant
on predictions(contestant_id);

create index idx_match_stage
on matches(stage);

create index idx_match_status
on matches(status);

create index idx_point_prediction
on point_breakdowns(prediction_id);

------------------------------------------------------------
-- UPDATED_AT TRIGGER
------------------------------------------------------------

create or replace function update_updated_at_column()
returns trigger
language plpgsql
as
$$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger trg_predictions_updated
before update
on predictions
for each row
execute function update_updated_at_column();
