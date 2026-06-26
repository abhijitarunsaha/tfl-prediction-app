-- ==========================================================
-- BASELINE SCORES
-- Tournament already in progress
-- ==========================================================

create table baseline_scores
(
    contestant_id uuid primary key
        references contestants(id)
        on delete cascade,

    starting_points integer not null default 0,

    updated_at timestamptz default now()
);
