---------------------------------------------------------
-- CONTESTANTS
---------------------------------------------------------

insert into contestants(name)
values
('Kaustav'),
('Durbar'),
('Santanu'),
('Abhijit'),
('Sayantan'),
('Jeet');

---------------------------------------------------------
-- BASELINE SCORES
---------------------------------------------------------

insert into baseline_scores(contestant_id, starting_points)

select id, 1290
from contestants
where name='Kaustav';

insert into baseline_scores(contestant_id, starting_points)

select id, 1220
from contestants
where name='Durbar';

insert into baseline_scores(contestant_id, starting_points)

select id, 1140
from contestants
where name='Santanu';

insert into baseline_scores(contestant_id, starting_points)

select id, 1010
from contestants
where name='Abhijit';

insert into baseline_scores(contestant_id, starting_points)

select id, 830
from contestants
where name='Sayantan';

insert into baseline_scores(contestant_id, starting_points)

select id, 680
from contestants
where name='Jeet';

---------------------------------------------------------
-- RULE CONFIGURATION
---------------------------------------------------------

insert into rule_configuration
(rule_name, rule_value, description)

values

('MATCH_RESULT_CORRECT',20,'Correct winner prediction'),

('MATCH_RESULT_WRONG',-10,'Incorrect winner prediction'),

('EXACT_SCORE',20,'Exact score'),

('GOAL_DIFFERENCE',10,'Correct goal difference'),

('CORRECT_SCORER',10,'Correct scorer'),

('OWN_GOAL_PENALTY',-10,'Predicted player scored own goal'),

('OVERPREDICT_3',-10,'Predicted goals exceed by 3 or 4'),

('OVERPREDICT_5',-20,'Predicted goals exceed by 5 or more'),

('MATCH_DECISION',10,'Correct match decision (90 mins / Extra Time / Penalties)'),

('GOLDEN_BOOT',75,'Golden Boot'),

('GOLDEN_BALL',75,'Golden Ball'),

('GOLDEN_GLOVE',75,'Golden Glove'),

('SEMIFINAL_BEFORE_R16',50,'Semi Final'),

('FINAL_BEFORE_R16',75,'Final'),

('CHAMPION_BEFORE_R16',100,'Champion');
