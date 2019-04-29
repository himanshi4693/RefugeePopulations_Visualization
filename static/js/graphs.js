queue()
    .defer(d3.json, "/donorschoose/refugees")
    .defer(d3.json, "static/geojson/europe-countries.json")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {
	
	//Clean projectsJson data
	var donorschooseProjects = projectsJson;

	//Create a Crossfilter instance
	var ndx = crossfilter(donorschooseProjects);

	//Define Dimensions
	var yearDim = ndx.dimension(function(d) { return d["Year"]; });
	var countryDim = ndx.dimension(function(d) { return d["Country or territory of asylum or residence"]; });
	var originCountryDim = ndx.dimension(function(d) { return d["Country or territory of origin"]; });



	//Calculate metrics
	var numRefugeesByYear= yearDim.group().reduceSum(function(d) {
	return d["Refugees<sup>*</sup>"];
	});;
	var totalRefugeesInCountry = countryDim.group().reduceSum(function(d) {
	return d["Refugees<sup>*</sup>"];
	});


	var originCountryWiseNumeRefugees = originCountryDim.group().reduceSum(function(d) {
	return d["Refugees<sup>*</sup>"];
	});


	var all = ndx.groupAll();
	var maxrefugees_country = totalRefugeesInCountry.top(1)[0].value;

	//Define values (to be used in charts)
	var minDate = yearDim.bottom(1)[0]["Year"];
	var maxDate = yearDim.top(1)[0]["Year"];

    //Charts
	var timeChart = dc.barChart("#time-chart");
	//var areaLineChart = dc.lineChart("#area-chart");
	var pieChart = dc.pieChart('#pie-chart');
	var usChart = dc.geoChoroplethChart("#us-chart");



	timeChart
		.width(800)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 80})
		.dimension(yearDim)
		.group(numRefugeesByYear)
		.transitionDuration(500)
		.colors(["#491065"])
		//.x(d3.scale.linear().domain([minDate, maxDate]))
		.x(d3.scale.ordinal().domain(yearDim)) // Need the empty val to offset the first value
 		.xUnits(dc.units.ordinal)
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxisLabel("Refugee Count")
		.yAxis().ticks(10)
		;

		timeChart.xAxis().tickFormat(function(v) {return v;});

	pieChart
		.width(600)
		.height(300)
		.dimension(originCountryDim)
		.cap(5)
		.innerRadius(80)
		// .legend(dc.legend().x(200).y(200).gap(5))
		.colors(['#CC14A2', '#993D84', '#9300FF', '#FFF240', '#CCAD14', '#4F0CE8'])
		.group(originCountryWiseNumeRefugees)
		.transitionDuration(500);


	usChart.width(1000)
		.height(1000)
		.dimension(countryDim)
		.group(totalRefugeesInCountry)
		//.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])

		.colors(["#f5e0ff", "#ebc2ff", "#df9eff", "#d580ff", "#ce6bff", "#c552ff", "#bd38ff", "#b41fff", "#aa00ff", "#7700b3"])
		
		.colorDomain([0, maxrefugees_country])
		.overlayGeoJson(statesJson["features"], "state", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.mercator()
					.center([ 13, 52 ])
					.translate([ 250, 195 ]) 
					.scale([ 400 ])
    				// .scale(600)
    				// .translate([340, 150])
    				)
		.title(function (p) {
			return "Country of Asylum: " + p["key"]
					+ "\n"
					+ "Total Refugees: " + p["value"];
		})

    dc.renderAll();

};




//OLD PROJECT!!!




// queue()
//     .defer(d3.json, "/donorschoose/projects")
//     .defer(d3.json, "static/geojson/us-states.json")
//     .await(makeGraphs);

// function makeGraphs(error, projectsJson, statesJson) {
	
// 	//Clean projectsJson data
// 	var donorschooseProjects = projectsJson;
// 	var dateFormat = d3.time.format("%Y-%m-%d");
// 	donorschooseProjects.forEach(function(d) {
// 		d["date_posted"] = dateFormat.parse(d["date_posted"]);
// 		d["date_posted"].setDate(1);
// 		d["total_donations"] = +d["total_donations"];
// 	});

// 	//Create a Crossfilter instance
// 	var ndx = crossfilter(donorschooseProjects);

// 	//Define Dimensions
// 	var dateDim = ndx.dimension(function(d) { return d["date_posted"]; });
// 	var resourceTypeDim = ndx.dimension(function(d) { return d["resource_type"]; });
// 	var povertyLevelDim = ndx.dimension(function(d) { return d["poverty_level"]; });
// 	var stateDim = ndx.dimension(function(d) { return d["school_state"]; });
// 	var totalDonationsDim  = ndx.dimension(function(d) { return d["total_donations"]; });


// 	//Calculate metrics
// 	var numProjectsByDate = dateDim.group(); 
// 	var numProjectsByResourceType = resourceTypeDim.group();
// 	var numProjectsByPovertyLevel = povertyLevelDim.group();
// 	var totalDonationsByState = stateDim.group().reduceSum(function(d) {
// 		return d["total_donations"];
// 	});

// 	var all = ndx.groupAll();
// 	var totalDonations = ndx.groupAll().reduceSum(function(d) {return d["total_donations"];});

// 	var max_state = totalDonationsByState.top(1)[0].value;

// 	//Define values (to be used in charts)
// 	var minDate = dateDim.bottom(1)[0]["date_posted"];
// 	var maxDate = dateDim.top(1)[0]["date_posted"];

//     //Charts
// 	var timeChart = dc.barChart("#time-chart");
// 	var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
// 	var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
// 	var usChart = dc.geoChoroplethChart("#us-chart");
// 	var numberProjectsND = dc.numberDisplay("#number-projects-nd");
// 	var totalDonationsND = dc.numberDisplay("#total-donations-nd");

// 	numberProjectsND
// 		.formatNumber(d3.format("d"))
// 		.valueAccessor(function(d){return d; })
// 		.group(all);

// 	totalDonationsND
// 		.formatNumber(d3.format("d"))
// 		.valueAccessor(function(d){return d; })
// 		.group(totalDonations)
// 		.formatNumber(d3.format(".3s"));

// 	timeChart
// 		.width(600)
// 		.height(160)
// 		.margins({top: 10, right: 50, bottom: 30, left: 50})
// 		.dimension(dateDim)
// 		.group(numProjectsByDate)
// 		.transitionDuration(500)
// 		.x(d3.time.scale().domain([minDate, maxDate]))
// 		.elasticY(true)
// 		.xAxisLabel("Year")
// 		.yAxis().ticks(4);

// 	resourceTypeChart
//         .width(300)
//         .height(250)
//         .dimension(resourceTypeDim)
//         .group(numProjectsByResourceType)
//         .xAxis().ticks(4);

// 	povertyLevelChart
// 		.width(300)
// 		.height(250)
//         .dimension(povertyLevelDim)
//         .group(numProjectsByPovertyLevel)
//         .xAxis().ticks(4);


// 	usChart.width(1000)
// 		.height(330)
// 		.dimension(stateDim)
// 		.group(totalDonationsByState)
// 		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
// 		.colorDomain([0, max_state])
// 		.overlayGeoJson(statesJson["features"], "state", function (d) {
// 			return d.properties.name;
// 		})
// 		.projection(d3.geo.albersUsa()
//     				.scale(600)
//     				.translate([340, 150]))
// 		.title(function (p) {
// 			return "State: " + p["key"]
// 					+ "\n"
// 					+ "Total Donations: " + Math.round(p["value"]) + " $";
// 		})

//     dc.renderAll();

// };