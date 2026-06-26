alter table baseline_scores
drop constraint baseline_scores_contestant_id_fkey;

alter table baseline_scores
add constraint fk_baseline_scores_contestant
foreign key (contestant_id)
references contestants(id)
on delete cascade;