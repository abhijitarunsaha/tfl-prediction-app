alter table matches

add column home_team_id uuid
references teams(id);

alter table matches

add column away_team_id uuid
references teams(id);