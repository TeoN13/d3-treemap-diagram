document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
  fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"),

  fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"),

  fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")]).


  then(([res1, res2, res3]) =>
  Promise.all([res1.json(), res2.json(), res3.json()])).

  then(([kickstart, movies, games]) => {
    const title = d3.select("#title");
    const tooltip = d3.select("#tooltip");
    const container = d3.select("#container");
    const description = d3.select("#description");

    const titles = [
    '<span id="title-main">Video Game Sales</span><br/>Top 100 Most Sold Video Games Grouped by Platform',
    '<span id="title-main">Movie Sales</span><br/>Top 100 Highest Grossing Movies Grouped By Genre',
    '<span id="title-main">Kickstarter Pledges</span><br/>Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'];


    const width = 960;
    const height = 600;

    // Game colors
    const color1 = d3.
    scaleOrdinal().
    range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56",
    "#d0743c",
    "#ff8c00"]);


    // Movie colors
    const color2 = d3.
    scaleOrdinal().
    range(["#AB75FF", "#796BE8", "#8294FF", "#6B9FE8", "#75D2FF"]);

    // Kickstart colors
    const color3 = d3.
    scaleOrdinal().
    range([
    "#FFC0CB",
    "#ADD8E6",
    "#90EE90",
    "#FFB6C1",
    "#B0E0E6",
    "#98FB98",
    "#F0FFFF"]);


    const treemap = d3.treemap().size([width, height]).padding(1);

    const chart = d3.
    select("#container").
    append("svg").
    attr("width", width).
    attr("height", height);

    // Display game data when page 1st loads
    makeTree(games, color1);

    const navGames = d3.select("#nav-games");
    const navMovies = d3.select("#nav-movies");
    const navKickstarter = d3.select("#nav-kickstarter");

    navGames.on("click", () => {
      makeTree(games, color1);
    });

    navMovies.on("click", () => {
      makeTree(movies, color2);
    });

    navKickstarter.on("click", () => {
      makeTree(kickstart, color3);
    });

    function makeTree(data, color) {
      // Clear existing tree elements
      chart.html("");

      // Show title
      title.html(
      data["name"] === "Movies" ?
      titles[1] :
      data["name"] === "Kickstarter" ?
      titles[2] :
      titles[0]);


      const root = d3.
      hierarchy(data).
      eachBefore(d => {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
      }).
      sum(d => d.value).
      sort((a, b) => b.height - a.height || b.value - a.value);

      treemap(root);

      const cell = chart.
      selectAll("g").
      data(root.leaves()).
      enter().
      append("g").
      attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

      cell.
      append("rect").
      attr("id", d => d.data.id).
      attr("class", "tile").
      attr("width", d => d.x1 - d.x0).
      attr("height", d => d.y1 - d.y0).
      attr("data-name", d => d.data.name).
      attr("data-category", d => d.data.category).
      attr("data-value", d => d.data.value).
      style("fill", d => color(d.data.category))
      //////////////// TOOLTIP ////////////////////
      .on("mousemove", (event, d) => {
        d3.select("#tooltip").
        style("display", "block").
        style("left", event.pageX + 10 + "px").
        style("top", event.pageY - 25 + "px").
        attr("data-value", d.data.value).
        html(
        `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`);

      }).
      on("mouseout", () => {
        d3.select("#tooltip").style("display", "none");
      });

      cell.
      append("text").
      attr("class", "tile-text").
      selectAll("tspan").
      data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)).
      enter().
      append("tspan").
      attr("x", 4).
      attr("y", (d, i) => 13 + i * 10).
      text(d => d);

      const categories = root.leaves().map(nodes => nodes.data.category);
      const uniqueCategories = categories.filter(
      (category, index) => categories.indexOf(category) === index);


      ////////////////////// LEGEND ////////////////////////////
      // Define the legend as a selection of the #legend element
      const legend = d3.select("#legend");

      // Clear existing legend elements
      legend.html("");

      color.domain().forEach(category => {
        const row = legend.append("div").attr('class', 'legend-element');
        row.
        append("rect").
        attr('class', 'legend-item').
        style("background-color", color(category)).
        attr('fill', color(category)).
        style("width", "20px").
        style("height", "20px").
        style("display", "inline-block");
        row.
        append("span").
        text(category).
        style("margin-left", "10px").
        style("font-size", "16px");
      });

      ////////////////////// END LEGEND ////////////////////////////
    }

    // END
  }).
  catch(error => console.error(error));
});