USE bamazon;

select 
	d.dept_id as "department_id",
    d.dept_name as "department_name",
    d.dept_overhead as "over_head_cost",
    sum(p.product_sales) as product_sales,
    sum(p.product_sales) - d.dept_overhead as "total_profit"
from
	departments d inner join
    products p
on
	d.dept_id = p.department_id
group by
	p.department_id