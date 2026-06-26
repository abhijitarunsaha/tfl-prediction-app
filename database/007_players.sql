create table players (
    id uuid primary key default gen_random_uuid(),

    team_id uuid not null
        references teams(id)
        on delete cascade,

    player_name text not null,

    jersey_number integer,

    position text,

    is_goalkeeper boolean default false,

    active boolean default true,

    created_at timestamptz default now()
);

create index idx_players_team
on players(team_id);