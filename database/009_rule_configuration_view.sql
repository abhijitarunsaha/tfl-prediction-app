create or replace view v_rule_configuration as

select
    rule_name,
    rule_value
from rule_configuration;