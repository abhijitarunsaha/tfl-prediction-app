create table teams (
    id uuid primary key default gen_random_uuid(),
    fifa_code varchar(3) not null unique,
    name text not null,
    group_name text,
    flag_emoji text,
    created_at timestamptz default now()
);

create index idx_teams_code on teams(fifa_code);