create table provider_sync
(
    provider text primary key,

    last_sync timestamptz,

    version text,

    updated_matches integer,

    created_at timestamptz default now()
);