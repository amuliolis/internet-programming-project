# internet-programming-project
Term project for my CIS 408 Internet Programming course

The website displays a model of earth to the user, and displays points on the model that represent historical accesses to the website. This project serves as a demonstration of multiple technologies.

When the browser requests the webpage from the Node.js server, the server will send the webpage to the browser while collecting the IP address of the request. The IP address is used in a query to the database for the location. If the IP address does not exist in the database, the server will use an external API to retrieve the geographical location of the IP address, and then store that information into the database while simultaneously sending it to the browser to display the user’s own location. If the address does exist in the database, then the location is retrieved from the database instead of the external API, and the time of access is updated. Along with the user’s own location, the website also requests a list of the most recent accesses, and displays all of those points with the brightness of each point corresponding to how long ago the access was made.
