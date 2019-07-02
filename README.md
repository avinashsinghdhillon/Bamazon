# Bamazon
A node app that manages purchases, sales and inventory for the Bamazon store. The app has three operational modes.

## Developer - Avinash Singh.

* ### Customer Mode
    * Displays items available for purchase that have more than zero inventory.
    * Allows customer to purchase an item by entering the item id and then the quantity.
    * Displays the total purchase cost if the sale is processed.

* ### Manager Mode
    * Allows the manager four task choices:
        * #### View Products for Sale.
            Displays a list of products available for sale and their inventory
        * #### View Low Inventory.
            Displays a list of products that have less than 5 units in stock
        * #### Add to Inventory.
            Allows the manager to select the ID of the item and then add number of units to the inventory
        * #### Add a new Product
            Allows the manager to select from the existing categories, product name and initial inventory to add a new product to store.

* ### Supervisor Mode
    * Allows the supervisor two task choices:
        * #### View Product Sales by Department.
            Displays a list of departments, with their overhead costs, product sales and net profit.
        * #### Create a new Department.
            Allows the supervisor to add a new category/department to the store. Enter the department name followed by the overhead for that department.

* ### Demo Images

    ![Customer Mode](https://github.com/avinashsinghdhillon/Bamazon/blob/master/Images/CustomerJSDemo.PNG)
    ![Manager Mode](https://github.com/avinashsinghdhillon/Bamazon/blob/master/Images/ManagerJSDemo.PNG)
    ![Supervisor Mode](https://github.com/avinashsinghdhillon/Bamazon/blob/master/Images/SupervisorJSDemo.PNG)
