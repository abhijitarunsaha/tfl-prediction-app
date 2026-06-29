create table provider_sync
(
    provider text primary key,

    last_sync timestamptz,

    version text,

    updated_matches integer default 0,

    last_status text default 'SUCCESS',

    last_error text,

    created_at timestamptz default now()
);