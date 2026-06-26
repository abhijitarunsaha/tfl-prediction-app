create policy "Public access contestants"
on contestants
for all
using (true)
with check (true);

create policy "Public access baseline_scores"
on baseline_scores
for all
using (true)
with check (true);

create policy "Public access matches"
on matches
for all
using (true)
with check (true);

create policy "Public access predictions"
on predictions
for all
using (true)
with check (true);

create policy "Public access prediction_scorers"
on prediction_scorers
for all
using (true)
with check (true);

create policy "Public access match_results"
on match_results
for all
using (true)
with check (true);

create policy "Public access match_scorers"
on match_scorers
for all
using (true)
with check (true);

create policy "Public access point_breakdowns"
on point_breakdowns
for all
using (true)
with check (true);

create policy "Public access rule_configuration"
on rule_configuration
for all
using (true)
with check (true);