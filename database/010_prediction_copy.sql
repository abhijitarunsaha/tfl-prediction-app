alter table predictions
add column if not exists copied_from uuid
references contestants(id);

create index if not exists idx_predictions_copied_from
on predictions(copied_from);